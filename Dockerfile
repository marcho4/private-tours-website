FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY next.config.ts .
COPY tsconfig.json .
COPY tailwind.config.mjs .
COPY postcss.config.mjs .
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY hooks ./hooks

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./


EXPOSE 3000

CMD ["npm", "start"]