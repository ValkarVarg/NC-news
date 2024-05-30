# Northcoders News API

Link to hosted version: *Include once works*

This project allows for API requests to view and update articles, comments, users and topics.

Features include:
View all : articles, topics, users
View article by article Id
View all articles on a specific topic
View all comments on an article
Post a comment to an article
Delete a comment
Add or Subtract votes from an article

Full details on all endpoints can be found by running a GET /API request.


Setup Instructions:

To clone this, run git clone https://github.com/ValkarVarg/NC-news.git

Once cloned, you will need to install the following dependencies:
Developer Dependencies:
Husky - run the scripts "npm run prepare"
Jest - "npm i jest -d"
Jest-extended - "npm i jest-extended -d"
pg-format - "npm i pg-format"

Dependencies:
dotenv - "npm i dotenv"
express - "npm i express"
jest-sorted - "npm i jest-sorted"
pg - "npm i pg"
supertest - "npm i supertest"

You will need two .env files to be created - .env.text and .env.development. These will need to be set up with PGDATABASE= and the correct database names for the test and development databases.

Setup Databases: run the script "npm run setup-dbs" to initialise the databases
Seeding: run the script "npm run seed" to seed the dev version of the database
Testing: run the stript "npm run test" to run the test files. This will seed the test database automatically


Minimum Versions:
Node - >6.9.0
Postgres - >8.7.3

Hosting:
To host this, you will need a thrid .env.production file with a DATABASE_URL variable to be set up
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)



