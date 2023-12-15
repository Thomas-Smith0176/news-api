# News API

This project creates an API which processes requests to a news server containing articles, comments, and user information. This is intended to mimic the behaviour of a real world back-end service for a site such as Reddit.

#### Hosted at: https://toms-news-server.onrender.com/api

## Cloning And Using This Repo

To successfully connect to the test and development databases locally, anyone wishing to clone this repo will need to:

* Ensure Node.js v17.0 or greater and Postgres v14.0 or greater are installed.

* Run the command  ```` npm install ````  to install the necessary dependencies.

* Set up the required environment variables by: 
    * Creating .env.development file containing the code ```` PGDATABASE=nc_news ````

    * Creating a .env.test file containing the code ```` PGDATABASE=nc_news_test ````

## Seeding and Testing

To seed the local databases and run tests, the following scripts should be ran:

* ```` npm run setup-dbs ```` : sets up the test and development databases.
* ```` npm run seed ````  : seeds the development database.
* ```` npm run test ````  : runs the test suite and seeds the test database.

