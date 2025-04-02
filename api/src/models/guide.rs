use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Guide {
    pub id: String,
    pub name: String,
    pub bio: String,
    pub experience: String,
    pub specialization: Vec<String>,
    pub languages: Vec<String>,
    pub photo: String,
}
