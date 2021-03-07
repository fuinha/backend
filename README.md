# 🛠 petcode/backend

![lint status](https://github.com/petcodeapp/backend/workflows/lint/badge.svg)
![format status](https://github.com/petcodeapp/backend/workflows/format/badge.svg)
![build status](https://github.com/petcodeapp/backend/workflows/build/badge.svg)
![GitHub](https://img.shields.io/github/license/petcodeapp/backend)
![GitHub issues](https://img.shields.io/github/issues/petcodeapp/backend)
![GitHub contributors](https://img.shields.io/github/contributors/petcodeapp/backend)
![GitHub last commit](https://img.shields.io/github/last-commit/petcodeapp/backend)

The complete backend of the PetCode programme.

Stack: NestJS + Typescript + Postgres + Redis + GraphQL.

## Installation

```bash
$ yarn
```

## Enviroment parameters

Set `redis` and `db` to the URLs of your instances (for instance, `redis` might be something like `redis://localhost:9998/`, and `db` might be `postgres://postgres@localhost:7823/postgres`) in environment settings

### Example `.env` file:

```dotenv
db="postgres://postgres@localhost:7823/postgres"
redis="redis://localhost:9998/"
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Normandy is [MPL-2.0 licensed](LICENSE).
