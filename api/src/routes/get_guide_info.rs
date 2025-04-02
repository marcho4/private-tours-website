use actix_web::{web, HttpResponse, get};

use crate::models::guide::Guide;

#[get("/guide")]
pub async fn get_guide_info() -> web::Json<Guide> {
    web::Json(Guide {
        id: "1".to_string(),
        name: "Наталья Дергилёва".to_string(),
        bio: "Экскурсовод по Москве".to_string(),
        experience: "Более 3-ёх лет экскурсионной практики".to_string(),
        specialization: vec!["История".to_string(), "Культура".to_string(), "Литература".to_string(), "Музеи".to_string(), "Архитектура".to_string()],
        languages: vec!["Русский".to_string(), "Английский".to_string(), "Французский".to_string()],
        photo: "https://via.placeholder.com/150".to_string(),
    })
}