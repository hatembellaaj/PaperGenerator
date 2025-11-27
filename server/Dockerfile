FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

ENV NODE_ENV=production
ENV PORT=9551
EXPOSE 9551

CMD ["npm", "run", "start"]
