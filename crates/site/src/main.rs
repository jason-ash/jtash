use askama::Template;
use site::{
    Article, ArticleTemplate, ContentRenderer, HomeTemplate, NotFoundTemplate,
    error::{Error, Result},
};
use std::{fs, path::Path};

fn main() -> Result<()> {
    // find all articles in the 'content' directory and collect them into a Vec
    let renderer = ContentRenderer::new()?;
    let mut articles = load_content(Path::new("content"), &renderer)?;

    // once new articles are loaded successfully, delete the old 'dist' folder
    match fs::remove_dir_all("dist") {
        Ok(()) => {}
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => return Err(error.into()),
    }

    // create distribution directories; copy article resources and shared assets
    copy_assets(Path::new("assets"), Path::new("dist/assets"))?;
    fs::write("dist/assets/code.css", renderer.code_css()?)?;

    // iterate through the array of articles, rendering them into html and moving to 'dist'
    for article in &articles {
        let output_directory = article.output_directory(Path::new("dist"))?;
        copy_assets(&article.source_directory, &output_directory)?;
        let template = ArticleTemplate { article };
        fs::write(article.output_path(Path::new("dist"))?, template.render()?)?;
    }

    // homepage
    articles.sort_by(|a, b| {
        b.metadata
            .date
            .cmp(&a.metadata.date)
            .then_with(|| a.metadata.title.cmp(&b.metadata.title))
    });
    let homepage = HomeTemplate {
        articles: &articles,
    };
    fs::write("dist/index.html", homepage.render()?)?;

    // 404 page
    fs::write("dist/404.html", NotFoundTemplate.render()?)?;

    Ok(())
}

fn load_content(directory: &Path, renderer: &ContentRenderer) -> Result<Vec<Article>> {
    let mut articles = Vec::default();

    for entry in fs::read_dir(directory)? {
        let entry = entry?;
        let kind = entry.file_type()?;

        if kind.is_dir() {
            articles.extend(load_content(&entry.path(), renderer)?);
        } else if kind.is_file() && entry.file_name() == "index.md" {
            let markdown_path = entry.path();
            let markdown = fs::read_to_string(&markdown_path)?;
            let document = renderer.render(&markdown).map_err(|error| {
                Error::ContentError(format!("{}: {error}", markdown_path.display()))
            })?;
            let article = Article::from_document(directory.to_path_buf(), document);
            articles.push(article);
        }
    }

    Ok(articles)
}

fn copy_assets(source: &Path, destination: &Path) -> Result<()> {
    fs::create_dir_all(destination)?;
    for entry in fs::read_dir(source)? {
        let entry = entry?;
        let source_path = entry.path();
        let destination_path = destination.join(entry.file_name());
        let file_type = entry.file_type()?;

        if file_type.is_dir() {
            copy_assets(&source_path, &destination_path)?;
        } else if file_type.is_file() {
            if source_path.extension().is_some_and(|ext| ext == "md") {
                continue;
            }
            fs::copy(&source_path, &destination_path)?;
        }
    }

    Ok(())
}
