FROM node:12.16.3

# set a directory for the app
WORKDIR /var/app/current/

# install dependencies
COPY package*.json ./
RUN npm ci --only=production

# copy all the files to the container
COPY ./ ./

# run the command
CMD ["/bin/bash"]