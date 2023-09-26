FROM node:19-alpine

WORKDIR /usr/src/app

# Copy the frontend folder to the container, except what is in .dockerignore file
COPY . .

RUN npm install

RUN npm run build

EXPOSE $FRONTEND_PORT


# Run the start script in dev mode, to watch logs
ENTRYPOINT ["npx", "next", "dev", "-p", "8000"]

# Run the start script in prod mode, to go in production
# ENTRYPOINT ["npm", "run", "start:prod"]
