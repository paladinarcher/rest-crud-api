# Document API

## Getting Started
1. Clone the repo
2. Run `npm install` in the directory.
3. Set up a environment file in the root of the app called `.env` the file will hold your AWS keys. The file should look like this:
```
AWS_ACCESS_KEY_ID={{Your Access Key}}
AWS_SECRET_ACCESS_KEY={{Your Secret Access Key}}
```
3. Run `docker-compose build` followed by `docker-compose up` This will run the API in development mode running at `0.0.0.0:3000` Changes in the project will be reflected in the API.

## Unit Testing
You can run unit tests by using the command `npm run test`

## E2E Testing
These tests can be run by using the command `npm run test-e2e`

## Production
Run `docker-compose -f docker-compose.yml build` followed by `docker-compose up` This will run the API in prod mode running at `0.0.0.0:3000`.