use chrono::NaiveDate;
use giallo::{HighlightOptions, HtmlRenderer, Registry, RenderOptions, ThemeVariant};
use math_core::{LatexToMathML, MathDisplay};
use pulldown_cmark::{CodeBlockKind, Event, Options, Parser, Tag, TagEnd, html};
use serde::{Deserialize, de::DeserializeOwned};
use std::path::{Path, PathBuf};

use crate::error::{Error, Result};

const CODE_THEME: &str = "github-light";
const CODE_CLASS_PREFIX: &str = "syntax-";
const MARKDOWN_OPTIONS: Options = Options::empty()
    .union(Options::ENABLE_MATH)
    .union(Options::ENABLE_TABLES)
    .union(Options::ENABLE_FOOTNOTES)
    .union(Options::ENABLE_STRIKETHROUGH)
    .union(Options::ENABLE_HEADING_ATTRIBUTES);

pub struct Article {
    pub source_directory: PathBuf,
    pub metadata: ArticleMetadata,
    pub html: String,
}

impl Article {
    fn relative_directory(&self) -> Result<&Path> {
        self.source_directory
            .strip_prefix("content")
            .ok()
            .filter(|path| !path.as_os_str().is_empty())
            .ok_or_else(|| {
                Error::IoError(format!(
                    "Invalid article source: {}",
                    self.source_directory.display()
                ))
            })
    }

    pub fn url(&self) -> Result<String> {
        Ok(format!("/{}/", self.relative_directory()?.display()))
    }

    pub fn output_directory(&self, output_root: &Path) -> Result<PathBuf> {
        Ok(output_root.join(self.relative_directory()?))
    }

    pub fn output_path(&self, output_root: &Path) -> Result<PathBuf> {
        Ok(output_root.join(self.relative_directory()?.join("index.html")))
    }

    pub fn from_document(
        source_directory: PathBuf,
        document: RenderedDocument<ArticleMetadata>,
    ) -> Self {
        Self {
            source_directory,
            metadata: document.metadata,
            html: document.html,
        }
    }
}

#[derive(Deserialize)]
pub struct ArticleMetadata {
    pub title: String,
    pub date: NaiveDate,
    #[serde(default)]
    pub excerpt: String,
}

pub struct RenderedDocument<M> {
    pub metadata: M,
    pub html: String,
}

pub struct ContentRenderer {
    math: LatexToMathML,
    code_registry: Registry,
    code_renderer: HtmlRenderer,
}

impl ContentRenderer {
    pub fn new() -> Result<Self> {
        let mut code_registry = Registry::builtin()?;
        code_registry.link_grammars();

        Ok(Self {
            math: LatexToMathML::default(),
            code_registry,
            code_renderer: HtmlRenderer {
                css_class_prefix: Some(CODE_CLASS_PREFIX.to_owned()),
                ..Default::default()
            },
        })
    }

    pub fn render<M: DeserializeOwned>(&self, markdown: &str) -> Result<RenderedDocument<M>> {
        let (frontmatter, body) = Self::split_frontmatter(markdown)?;
        let metadata = Self::parse_metadata(frontmatter)?;
        let html = self.render_markdown(body)?;
        Ok(RenderedDocument { metadata, html })
    }

    fn parse_metadata<M: DeserializeOwned>(frontmatter: Option<String>) -> Result<M> {
        Ok(match frontmatter {
            Some(yaml) => serde_saphyr::from_str::<M>(&yaml)?,
            None => serde_saphyr::from_str::<M>("null").map_err(|_| {
                Error::FrontmatterError(
                    "This document requires YAML frontmatter at the start of the file.".to_string(),
                )
            })?,
        })
    }

    fn split_frontmatter(markdown: &str) -> Result<(Option<String>, &str)> {
        let mut parser = Parser::new_ext(markdown, Options::ENABLE_YAML_STYLE_METADATA_BLOCKS)
            .into_offset_iter();
        let Some((Event::Start(Tag::MetadataBlock(_)), range)) = parser.next() else {
            return Ok((None, markdown));
        };

        if range.start != 0 {
            return Ok((None, markdown));
        }

        let mut yaml = String::default();
        for (event, range) in parser {
            match event {
                Event::Text(text) => yaml.push_str(&text),
                Event::End(TagEnd::MetadataBlock(_)) => {
                    return Ok((Some(yaml), &markdown[range.end..]));
                }
                _ => {}
            }
        }
        Err(Error::FrontmatterError(
            "Frontmatter incorrectly closed.".to_string(),
        ))
    }

    fn render_markdown(&self, markdown: &str) -> Result<String> {
        let mut parser = Parser::new_ext(markdown, MARKDOWN_OPTIONS);

        let mut events = Vec::default();
        while let Some(event) = parser.next() {
            match event {
                Event::Start(tag @ Tag::Table(_)) => {
                    events.push(Event::Html(
                        "<div class=\"table-scroll\" role=\"region\" aria-label=\"Table\" tabindex=\"0\">"
                            .into(),
                    ));
                    events.push(Event::Start(tag));
                }
                Event::End(TagEnd::Table) => {
                    events.push(Event::End(TagEnd::Table));
                    events.push(Event::Html("</div>".into()));
                }
                Event::Start(Tag::CodeBlock(kind)) => {
                    let language = match &kind {
                        CodeBlockKind::Fenced(info) => {
                            info.split_whitespace().next().unwrap_or("plain")
                        }
                        CodeBlockKind::Indented => "plain",
                    };

                    let mut source = String::default();
                    for code_event in parser.by_ref() {
                        match code_event {
                            Event::Text(text) => source.push_str(&text),
                            Event::End(TagEnd::CodeBlock) => break,
                            _ => {}
                        }
                    }

                    let options = HighlightOptions::new(language, ThemeVariant::Single(CODE_THEME))
                        .fallback_to_plain(true);
                    let highlighted = self.code_registry.highlight(&source, &options)?;
                    let code_html = self
                        .code_renderer
                        .render(&highlighted, &RenderOptions::default());
                    events.push(Event::Html(code_html.into()));
                }
                Event::InlineMath(latex) => {
                    let rendered = self
                        .math
                        .convert_with_local_state(&latex, MathDisplay::Inline)?;
                    events.push(Event::InlineHtml(
                        format!("<span class=\"inline-math\">{}</span>", rendered.mathml).into(),
                    ));
                }
                Event::DisplayMath(latex) => {
                    let rendered = self
                        .math
                        .convert_with_local_state(&latex, MathDisplay::Block)?;
                    events.push(Event::Html(rendered.mathml.into()));
                }
                other => events.push(other),
            }
        }

        let mut body = String::default();
        html::push_html(&mut body, events.into_iter());
        Ok(body)
    }

    pub fn code_css(&self) -> Result<String> {
        let theme_css = self
            .code_registry
            .generate_css(CODE_THEME, CODE_CLASS_PREFIX)?;
        Ok(format!("{}\n{theme_css}", giallo::GIALLO_CSS))
    }
}
