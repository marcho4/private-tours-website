use serde::{Deserialize, Serialize};   

#[derive(Serialize, Deserialize)]
pub struct Tour {
    pub id: String,
    pub title: String,
    pub description: String,
    pub duration: String,
    pub price: f64,
    pub max_group_size: u32,
    pub category: String,
    pub images: Vec<String>,
}
