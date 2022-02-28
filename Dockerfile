# This is a dockerfile for building Docker image of Fragments project
# using node base images
# Stage 0: Install aline linux + node +dependencies 
FROM node:16.11.1-alpine3.14@sha256:de6a0e968273c5290f790bd8ef4ae300eaab372bbeec17e4849481328f1f2c17 AS dependencies

WORKDIR /app

LABEL maintainer="Emily Phan<hphan9@myseneca.ca>" \
      description="Fragments node.js microservice"

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

#disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

#Copy the package*.json file to current repo which is /app
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production
############################################################

FROM dependencies As run

WORKDIR /app

# use port 8080 by default
ENV PORT=8080

COPY --from=dependencies /app /app

#Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080

