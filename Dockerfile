FROM node:current-alpine
WORKDIR /opt/wallbase

COPY . .

RUN apk add graphicsmagick && \
    npm i && \
    npm run generate-dotenv && \
    npm run build && \
    npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
