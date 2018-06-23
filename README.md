# Account API

Create, Update, Delete and Search users.

## Prerequisites

* Docker
* docker-compose

## Installation

### 1) Environment

Create `.env` file and add following environment variables.

```
touch .env
```

```
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
NODE_ENV=development
MONGODB_HOST=db
MONGODB_PORT=27017
MONGODB_USERNAME=
MONGODB_PASSWORD=
PORT=3000
HOST=0.0.0.0
```

* MONGO_INITDB_ROOT_USERNAME: Mongodb root user for initialization.
* MONGO_INITDB_ROOT_PASSWORD: Mongodb root password for initialization.
* NODE_ENV: Use `development` for development and `production` for production.
* MONGODB_HOST: Hostname for mongoose to connect database.
* MONGODB_PORT: Database port.
* MONGODB_USERNAME: Database username. Should be same with MONGO_INITDB_ROOT_USERNAME.
* MONGODB_PASSWORD: Database password. Should be same with MONGO_INITDB_ROOT_PASSWORD.
* PORT: Express app listen port.
* HOST: Express app listen host.


### 2) Install Dependencies
Because [bcrypt](https://www.google.com) package uses different tools
for hashing password depends on os, you should install dependencies
in the container.

Run `docker-compose run app install` only installing dependencies.

## Running the tests

We are using mocha and chai for testing.

`docker-compose run app test` will run all tests.

## How to Use

See [API Documentation](docs/api.md)