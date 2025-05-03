FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN apt-get update && \
    apt-get install -y cmake pkg-config libssl-dev && \
    rm -rf /var/lib/apt/lists/*
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release --bin api

FROM debian:bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update && \
    apt-get install -y libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/api /app/api
COPY --from=builder /app/src/migrations/20230101000000_initial_schema.sql /app/src/migrations/20230101000000_initial_schema.sql
COPY --from=builder /app/cert.pem /app/cert.pem
COPY --from=builder /app/key.pem /app/key.pem

EXPOSE 8080
EXPOSE 8443
CMD ["./api"]