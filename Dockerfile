FROM node:lts-slim AS base

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

ARG ENTRIES_FILE_PATH
ENV ENTRIES_FILE_PATH=ENTRIES_FILE_PATH

RUN pnpm build
RUN pnpm prune --prod --no-optional

EXPOSE 3000
CMD ["node", "build"]

