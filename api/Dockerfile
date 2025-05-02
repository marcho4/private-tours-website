FROM rust:1-slim-bookworm

WORKDIR /app

# Настраиваем российские зеркала
RUN echo "deb http://mirror.yandex.ru/debian bookworm main" > /etc/apt/sources.list.d/mirror.list

# Устанавливаем необходимые зависимости
RUN apt-get update && \
    apt-get install -y libssl-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Копируем код
COPY . .

# Собираем приложение
RUN cargo build --release

# Экспонируем порты
EXPOSE 8080
EXPOSE 8443

# Запускаем
CMD ["./target/release/api"]