FROM node:current-alpine
WORKDIR /opt/wallbase

COPY . .

RUN npm i && \
    npm run generate-dotenv && \
    npm run build && \
    npm prune --production

EXPOSE 80 3000

CMD ["npm", "start"]
