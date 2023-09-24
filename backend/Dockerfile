FROM node:19-alpine

WORKDIR /usr/src/app

# Copy the backend folder to the container, except what is in .dockerignore file
COPY . .

RUN npm install

RUN npm install prisma --save-dev && \
  npx prisma && \
  npx prisma generate

EXPOSE $BACKEND_PORT

# Run the start script in dev mode, to watch logs
ENTRYPOINT ["npm", "run", "start:dev"]

# Run the start script in prod mode, to go in production
# ENTRYPOINT ["npm", "run", "start:prod"]
