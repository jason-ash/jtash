use askama::Template;

use crate::Article;

#[derive(Template)]
#[template(path = "article.html")]
pub struct ArticleTemplate<'a> {
    pub article: &'a Article,
}

#[derive(Template)]
#[template(path = "home.html")]
pub struct HomeTemplate<'a> {
    pub articles: &'a [Article],
}

#[derive(Template)]
#[template(path = "404.html")]
pub struct NotFoundTemplate;
