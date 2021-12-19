FROM node:alpine
WORKDIR .
COPY . .

# Install packages
RUN ["npm", "install"]

# Run bot
CMD npm t