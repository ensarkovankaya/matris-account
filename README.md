# Account API

Example nodejs/express microservice for basic account management.
This service use [Mongodb](https://www.mongodb.com/) as database and
[Graphql](https://graphql.org/) query language as api.

See [API Documentation](docs/api.md) to how to use.

## Prerequisites

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Installation

### 1) Setting up Environment

Create `.env` file and add following environment variables.

```
touch .env
```

```
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=root
NODE_ENV=dev
MONGODB_HOST=db
MONGODB_PORT=27017
MONGODB_USERNAME=root
MONGODB_PASSWORD=root
PORT=3000
HOST=0.0.0.0
```

* MONGO_INITDB_ROOT_USERNAME: Mongodb root user for initialization.
* MONGO_INITDB_ROOT_PASSWORD: Mongodb root password for initialization.
* NODE_ENV: Use `dev` for development, `prod` for production and `test` for testing. While environment is test all logs will be silent (no console output).
* MONGODB_HOST: Hostname for mongoose to connect database.
* MONGODB_PORT: Database port.
* MONGODB_USERNAME: Database username. Should be same with MONGO_INITDB_ROOT_USERNAME.
* MONGODB_PASSWORD: Database password. Should be same with MONGO_INITDB_ROOT_PASSWORD.
* PORT: Express app listen port.
* HOST: Express app listen host.


### 2) Installing Dependencies
Because [bcrypt](https://www.google.com) package uses different tools
for hashing password depends on os, you should install dependencies
in the container.

Run `docker-compose run app install` only installing dependencies.

## Running the tests

We are using mocha and chai for testing.

`docker-compose run app test` will run all tests.
