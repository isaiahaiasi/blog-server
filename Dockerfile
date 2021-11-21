# this initial Docker configuration based on this blog post:
# https://dev.to/dariansampare/setting-up-docker-typescript-node-hot-reloading-code-changes-in-a-running-container-2b2f

# DEVELOPMENT STEP
FROM node:16-alpine as base

WORKDIR /home/node/app

# take advantage of cached layers to avoid rebuilding modules unnecessarily
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package*.json ./

RUN npm install

# in production, I want to run this, but rn that's too complex
# similar to npm i, but fails if there's a discrepency in lock file
# RUN npm ci --only=production

# bundles the app source
COPY . .

# exposes the port used by the app
# not sure what the purpose of this is, since you still need -p flag,
# and I'm not sure how this interacts with using env vars for the port
# EXPOSE 3000

# PRODUCTION STEP
FROM base as production

ENV NODE_PATH=./dist

RUN npm run build
