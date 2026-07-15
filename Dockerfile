FROM node:20-alpine

WORKDIR /app

COPY ["Techno One/src/package.json", "./"]
RUN npm install --omit=dev && npm cache clean --force

COPY ["Techno One/src/", "."]

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
