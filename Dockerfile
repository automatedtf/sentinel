FROM node:alpine
WORKDIR .
COPY . .

# Install packages
RUN ["npm", "install"]

# Build .ts files
RUN ["npm", "run", "build"]

# Run bot
CMD npm start