pub mod error;
mod render;
mod view;

pub use render::{Article, ArticleMetadata, ContentRenderer, RenderedDocument};
pub use view::{ArticleTemplate, HomeTemplate, NotFoundTemplate};
