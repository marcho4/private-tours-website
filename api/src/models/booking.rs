use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Booking {
    pub tour_id: String,
    pub date: String,
    pub time_slot: String,
    pub number_of_people: u32,
    pub customer_name: String,
    pub customer_email: String,
    pub customer_phone: String,
    pub special_requests: String,
}