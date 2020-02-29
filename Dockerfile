FROM node:12.16.1

WORKDIR /usr/src/smart-vision-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]