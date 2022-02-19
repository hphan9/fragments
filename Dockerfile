# This is a dockerfile for building Docker image of Fragments project
# using node base images
FROM node:16.11.1

LABEL maintainer="Emily Phan<hphan9@myseneca.ca>" \
      description="Fragments node.js microservice"

# use port 8080 by default
ENV PORT=8080

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

#disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

# Use /apps as our working directory
WORKDIR /app

#Copy the package*.json file to current repo which is /app
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

#Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080
