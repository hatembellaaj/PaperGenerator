FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY public ./public

ARG VITE_API_BASE_URL=http://localhost:9551/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

EXPOSE 9550

CMD ["npm", "run", "preview", "--", "--host", "--port", "9550"]
