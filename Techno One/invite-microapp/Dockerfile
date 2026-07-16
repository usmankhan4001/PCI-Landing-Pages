FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3100

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY public ./public

COPY README.md ./README.md

EXPOSE 3100

CMD ["node", "server.js"]
