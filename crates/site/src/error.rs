pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    ContentError(String),
    FrontmatterError(String),
    HighlightError(String),
    IoError(String),
    MathError(String),
    TemplateError(String),
}

impl std::error::Error for Error {}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::ContentError(s) => write!(f, "ContentError: {s}"),
            Self::FrontmatterError(s) => write!(f, "FrontmatterError: {s}"),
            Self::HighlightError(s) => write!(f, "HighlightError: {s}"),
            Self::IoError(s) => write!(f, "IoError: {s}"),
            Self::MathError(s) => write!(f, "MathError: {s}"),
            Self::TemplateError(s) => write!(f, "TemplateError: {s}"),
        }
    }
}

impl From<askama::Error> for Error {
    fn from(value: askama::Error) -> Self {
        Self::TemplateError(value.to_string())
    }
}

impl From<giallo::Error> for Error {
    fn from(value: giallo::Error) -> Self {
        Self::HighlightError(value.to_string())
    }
}

impl From<Box<math_core::LatexError>> for Error {
    fn from(value: Box<math_core::LatexError>) -> Self {
        Self::MathError(value.to_string())
    }
}

impl From<serde_saphyr::Error> for Error {
    fn from(value: serde_saphyr::Error) -> Self {
        Self::FrontmatterError(value.to_string())
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Self::IoError(value.to_string())
    }
}
