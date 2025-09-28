FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY server.js ./

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]