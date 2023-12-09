FROM node:18-alpine

COPY . .
RUN npm install --production

ENV NODE_ENV production
CMD ["npm", "run", "start"]