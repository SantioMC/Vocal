FROM node:21-alpine

WORKDIR /app
COPY . .

# These are supplied so sveltekit can populate it's ambient.d.ts file
ARG PUBLIC_LIVEKIT_URL=ws://localhost:7880
ARG PUBLIC_SOCKET_URL=ws://localhost:8001
ARG PUBLIC_API_URL=http://localhost:8000
ARG PUBLIC_PRIMARY_COLOR=ffc2e3
ARG PUBLIC_SERVER_NAME=Vocal

# Install and build
RUN npm install
RUN npm run sync
RUN npm run build

RUN rm -rf src/ static/
USER node:node

ENV NODE_ENV production
CMD ["node","build/index.js"]