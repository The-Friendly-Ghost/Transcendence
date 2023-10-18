FROM node:19-alpine

WORKDIR /usr/src/app

# Copy the backend folder to the container, except what is in .dockerignore file
COPY . .

RUN npm install

EXPOSE $FRONTEND_PORT

# Run the start script in dev mode, to watch logs
ENTRYPOINT ["npm", "run", "dev"]
# -H $FRONTEND_HOST -p $FRONTEND_PORT"]

# Run the start script in prod mode, to go in production
# ENTRYPOINT ["npm", "run", "start"]
