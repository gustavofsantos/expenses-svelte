FROM node:lts-slim AS base

ARG AUTH_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .

ENV NODE_ENV=production
RUN pnpm build
RUN pnpm exec prisma migrate deploy
RUN pnpm prune --prod --no-optional

EXPOSE 3000
CMD ["node", "build"]

