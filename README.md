# smart-vision-api

The RESTful API of the smart-vision web app [github.com/tiagofbsantos/smart-vision](https://github.com/tiagofbsantos/smart-vision)

First you need to install docker on your machine [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
Then on your terminal: cd into the project folder and run the command: docker-compose up --build

Created using:

- Node.js

- Express.js

- PostgreSQL

- Knex to connect to the PostgreSQL database

- bcrypt to hash passwords

- Morgan for logging

- JSON Web Token and Redis for session authentication

- Docker for containers and Docker Compose for orchestration

- Clarifai API for face detection and celebrity recognition

You can find more info on this project at [tiagofbsantos.com](https://www.tiagofbsantos.com/)