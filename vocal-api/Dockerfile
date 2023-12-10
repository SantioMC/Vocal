FROM node:21-alpine

WORKDIR /app
COPY . .

RUN npm install --production
ENV NODE_ENV production

CMD ["npm", "run", "start"]