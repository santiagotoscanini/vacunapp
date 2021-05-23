# VacunApp

[Architecture Diagram](https://lucid.app/lucidchart/175e572a-ffd7-45cc-9a8f-ca56a302ef54/edit?beaconFlowId=B7484840EC0590A8&page=0_0#)

## Run Locally

### Production

* `npm run clean`: to delete the build folder.
* `npm run build`: to transpile the code.
* `npm start`: to run the transpiled code.

### Development

* `npm run dev`: This run a nodemon server that listen changes, configuration to run without building Typescript files
  is at `nodemon.json` files.

## Run in Docker

### Production

`docker compose up`

### Development

`docker compose -f docker-compose.dev.yml --env-file .env.dev up`

# IMPORTANT

We need to have in the root of the project the file `.env` for production and `.env.dev` for development.

Those files define the variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DB_DIALECT`, `DB_SCHEMA`, `DB_HOST`
, `NODE_ENV`
, `LOGIN_PORT`.
