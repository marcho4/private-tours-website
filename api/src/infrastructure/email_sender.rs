use lettre::message::header::ContentType;
use lettre::message::{MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};
use anyhow::Result;

pub struct EmailSender {
    smtp_host: String,
    smtp_port: u16,
    smtp_user: String,
    smtp_pass: String,
    from_name: String,
}

impl EmailSender {
    pub fn new(
        smtp_host: String,
        smtp_port: u16,
        smtp_user: String,
        smtp_pass: String,
        from_name: String,
    ) -> Self {
        Self {
            smtp_host,
            smtp_port,
            smtp_user,
            smtp_pass,
            from_name,
        }
    }

    async fn send(
        &self,
        to_email: &str,
        subject: &str,
        text_body: &str,
        html_body: &str,
    ) -> Result<()> {
        let from_address = format!("{} <{}>", self.from_name, self.smtp_user);
        
        let email = Message::builder()
            .from(from_address.parse()?)
            .to(to_email.parse()?)
            .subject(subject)
            .multipart(
                MultiPart::alternative()
                    .singlepart(
                        SinglePart::builder()
                            .header(ContentType::TEXT_PLAIN)
                            .body(text_body.to_string())
                    )
                    .singlepart(
                        SinglePart::builder()
                            .header(ContentType::TEXT_HTML)
                            .body(html_body.to_string())
                    )
            )?;

        let creds = Credentials::new(self.smtp_user.clone(), self.smtp_pass.clone());

        // TLS encrypted SMTP transport
        let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay(&self.smtp_host)?
            .credentials(creds)
            .port(self.smtp_port)
            .build();

        mailer.send(email).await?;

        Ok(())
    }

    pub async fn send_booking_created_notification(
        &self,
        to_email: &str,
        customer_name: &str,
        tour_name: &str,
        tour_date: &str,
        tour_time: &str,
        participants: u32,
        booking_id: &str,
        is_admin: bool,
    ) -> Result<()> {
        let subject = if is_admin {
            format!("Новое бронирование: {} ({} участников)", tour_name, participants)
        } else {
            format!("Подтверждение бронирования: {}", tour_name)
        };

        let text_body = self.build_booking_created_text(
            customer_name,
            tour_name,
            tour_date,
            tour_time,
            participants,
            booking_id,
            is_admin,
        );

        let html_body = self.build_booking_created_html(
            customer_name,
            tour_name,
            tour_date,
            tour_time,
            participants,
            booking_id,
            is_admin,
        );

        self.send(to_email, &subject, &text_body, &html_body).await
    }

    pub async fn send_booking_cancelled_notification(
        &self,
        to_email: &str,
        customer_name: &str, 
        tour_name: &str,
        tour_date: &str,
        booking_id: &str,
        is_admin: bool,
    ) -> Result<()> {
        let subject = if is_admin {
            format!("Отмена бронирования: {} (ID: {})", tour_name, booking_id)
        } else {
            format!("Ваше бронирование отменено: {}", tour_name)
        };

        let text_body = self.build_booking_cancelled_text(
            customer_name,
            tour_name,
            tour_date,
            booking_id,
            is_admin,
        );

        let html_body = self.build_booking_cancelled_html(
            customer_name,
            tour_name,
            tour_date,
            booking_id,
            is_admin,
        );

        self.send(to_email, &subject, &text_body, &html_body).await
    }

    pub async fn send_general_notification(
        &self,
        to_email: &str,
        subject: &str,
        text_content: &str,
        html_content: Option<&str>,
    ) -> Result<()> {
        let html = match html_content {
            Some(html) => html.to_string(),
            None => self.text_to_html(text_content),
        };

        self.send(to_email, subject, text_content, &html).await
    }

    // Private helper methods for email templates
    fn build_booking_created_text(
        &self,
        customer_name: &str,
        tour_name: &str,
        tour_date: &str,
        tour_time: &str,
        participants: u32,
        booking_id: &str,
        is_admin: bool,
    ) -> String {
        if is_admin {
            format!(
                "Новое бронирование!\n\n\
                Клиент: {}\n\
                Тур: {}\n\
                Дата: {}\n\
                Время: {}\n\
                Количество участников: {}\n\
                ID бронирования: {}\n\n\
                Пожалуйста, подтвердите данное бронирование в системе управления.",
                customer_name, tour_name, tour_date, tour_time, participants, booking_id
            )
        } else {
            format!(
                "Здравствуйте, {}!\n\n\
                Ваше бронирование успешно создано.\n\n\
                Детали бронирования:\n\
                Тур: {}\n\
                Дата: {}\n\
                Время: {}\n\
                Количество участников: {}\n\
                ID бронирования: {}\n\n\
                Спасибо, что выбрали нас! Если у вас возникли вопросы, пожалуйста, свяжитесь с нами.",
                customer_name, tour_name, tour_date, tour_time, participants, booking_id
            )
        }
    }

    fn build_booking_created_html(
        &self,
        customer_name: &str,
        tour_name: &str,
        tour_date: &str,
        tour_time: &str,
        participants: u32,
        booking_id: &str,
        is_admin: bool,
    ) -> String {
        if is_admin {
            format!(
                r#"<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Новое бронирование</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #4a6da7; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; border: 1px solid #ddd; border-top: none; }}
                        .booking-details {{ background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4a6da7; }}
                        .footer {{ margin-top: 20px; font-size: 12px; text-align: center; color: #777; }}
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Новое бронирование</h1>
                    </div>
                    <div class="content">
                        <p>В системе зарегистрировано новое бронирование:</p>
                        
                        <div class="booking-details">
                            <p><strong>Клиент:</strong> {}</p>
                            <p><strong>Тур:</strong> {}</p>
                            <p><strong>Дата:</strong> {}</p>
                            <p><strong>Время:</strong> {}</p>
                            <p><strong>Количество участников:</strong> {}</p>
                            <p><strong>ID бронирования:</strong> {}</p>
                        </div>
                        
                        <p>Пожалуйста, подтвердите данное бронирование в системе управления.</p>
                    </div>
                    <div class="footer">
                        <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
                    </div>
                </body>
                </html>"#,
                customer_name, tour_name, tour_date, tour_time, participants, booking_id
            )
        } else {
            format!(
                r#"<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Подтверждение бронирования</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #4a6da7; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; border: 1px solid #ddd; border-top: none; }}
                        .booking-details {{ background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4a6da7; }}
                        .footer {{ margin-top: 20px; font-size: 12px; text-align: center; color: #777; }}
                        .thank-you {{ font-size: 18px; margin: 20px 0; text-align: center; }}
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Подтверждение бронирования</h1>
                    </div>
                    <div class="content">
                        <p>Здравствуйте, {}!</p>
                        <p>Ваше бронирование успешно создано.</p>
                        
                        <div class="booking-details">
                            <p><strong>Тур:</strong> {}</p>
                            <p><strong>Дата:</strong> {}</p>
                            <p><strong>Время:</strong> {}</p>
                            <p><strong>Количество участников:</strong> {}</p>
                            <p><strong>ID бронирования:</strong> {}</p>
                        </div>
                        
                        <p class="thank-you">Спасибо, что выбрали нас!</p>
                        <p>Если у вас возникли вопросы, пожалуйста, свяжитесь с нами.</p>
                    </div>
                    <div class="footer">
                        <p>С уважением, команда экскурсий</p>
                    </div>
                </body>
                </html>"#,
                customer_name, tour_name, tour_date, tour_time, participants, booking_id
            )
        }
    }

    fn build_booking_cancelled_text(
        &self,
        customer_name: &str,
        tour_name: &str,
        tour_date: &str,
        booking_id: &str,
        is_admin: bool,
    ) -> String {
        if is_admin {
            format!(
                "Бронирование отменено\n\n\
                Клиент: {}\n\
                Тур: {}\n\
                Дата: {}\n\
                ID бронирования: {}\n\n\
                Бронирование было отменено. Пожалуйста, обновите информацию в системе.",
                customer_name, tour_name, tour_date, booking_id
            )
        } else {
            format!(
                "Здравствуйте, {}!\n\n\
                Ваше бронирование было отменено.\n\n\
                Детали отмененного бронирования:\n\
                Тур: {}\n\
                Дата: {}\n\
                ID бронирования: {}\n\n\
                Если у вас возникли вопросы, пожалуйста, свяжитесь с нами.",
                customer_name, tour_name, tour_date, booking_id
            )
        }
    }

    fn build_booking_cancelled_html(
        &self,
        customer_name: &str,
        tour_name: &str,
        tour_date: &str,
        booking_id: &str,
        is_admin: bool,
    ) -> String {
        if is_admin {
            format!(
                r#"<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Бронирование отменено</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #e74c3c; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; border: 1px solid #ddd; border-top: none; }}
                        .booking-details {{ background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #e74c3c; }}
                        .footer {{ margin-top: 20px; font-size: 12px; text-align: center; color: #777; }}
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Бронирование отменено</h1>
                    </div>
                    <div class="content">
                        <p>Бронирование было отменено:</p>
                        
                        <div class="booking-details">
                            <p><strong>Клиент:</strong> {}</p>
                            <p><strong>Тур:</strong> {}</p>
                            <p><strong>Дата:</strong> {}</p>
                            <p><strong>ID бронирования:</strong> {}</p>
                        </div>
                        
                        <p>Пожалуйста, обновите информацию в системе управления.</p>
                    </div>
                    <div class="footer">
                        <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
                    </div>
                </body>
                </html>"#,
                customer_name, tour_name, tour_date, booking_id
            )
        } else {
            format!(
                r#"<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Бронирование отменено</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #e74c3c; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; border: 1px solid #ddd; border-top: none; }}
                        .booking-details {{ background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #e74c3c; }}
                        .footer {{ margin-top: 20px; font-size: 12px; text-align: center; color: #777; }}
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Бронирование отменено</h1>
                    </div>
                    <div class="content">
                        <p>Здравствуйте, {}!</p>
                        <p>Ваше бронирование было отменено.</p>
                        
                        <div class="booking-details">
                            <p><strong>Тур:</strong> {}</p>
                            <p><strong>Дата:</strong> {}</p>
                            <p><strong>ID бронирования:</strong> {}</p>
                        </div>
                        
                        <p>Если у вас возникли вопросы, пожалуйста, свяжитесь с нами.</p>
                    </div>
                    <div class="footer">
                        <p>С уважением, команда экскурсий</p>
                    </div>
                </body>
                </html>"#,
                customer_name, tour_name, tour_date, booking_id
            )
        }
    }

    // Helper method to convert plain text to simple HTML
    fn text_to_html(&self, text: &str) -> String {
        let escaped_text = text.replace("&", "&amp;")
                              .replace("<", "&lt;")
                              .replace(">", "&gt;")
                              .replace("\n", "<br>");
        
        format!(
            r#"<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .content {{ padding: 20px; border: 1px solid #ddd; }}
                </style>
            </head>
            <body>
                <div class="content">
                    {}
                </div>
            </body>
            </html>"#,
            escaped_text
        )
    }
}
