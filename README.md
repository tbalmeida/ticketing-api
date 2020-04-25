# Ticketing 4 Good

Ticketing 4 Good is a final project developed at [Lighthouse Labs Web Bootcamp](https://www.lighthouselabs.ca/web-bootcamp)- 2020-01 YYC Cohort. It was developed with Anton Smirnov (@antosha-85).

Its objective is to provide NGOs a way to sell tickets using their own website and layout of preference, with a low cost.

The way it functions is simple: USERS can buy (or get, if they're free) TICKETS to EVENTS hosted on VENUES. 

Each ticket has a unique QR code that will be scanned to grant access to the event. 

A live version can be viewed [here](https://ticketing4good.netlify.app/)

## Stack

### Backend
- [Node.js Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Stripe](https://stripe.com/)

### Frontend
- [React](https://reactjs.org/)
- [MaterialUI](http://material-ui.com/)

## Components

T4G is a RESTful API and its full solution requires:

- this API;
- a front-end - we have our own [here](https://github.com/tbalmeida/ticketing-client);
- a scanning application to read the tickets (QR code).


## Setup

Install dependencies with `npm install`.

Make sure you have:
- A PostgreSQL server;
- A Stripe account
- An e-mail account ready to use (after all, this API will send e-mails with the tickets)


## Run The Server

```sh
npm start
```
or with nodemon
```sh
npm run dev
```
## Creating The DB

Use the `psql -U development` command to login to the PostgreSQL server with the username `development` and the password `development`. 

Create a database with the command `CREATE DATABASE ticketing_development;`.

Copy the `.env.example` file to `.env.development` and fill in the necessary PostgreSQL configuration. The `node-postgres` library uses these environment variables by default.

```
PGHOST=localhost
PGUSER=development
PGDATABASE=ticketing_development
PGPASSWORD=development
PGPORT=5432
EMAIL=
PASSWORD=
PUBLISHABLE_KEY=
SECRET_KEY=
```

## Seeding

Run a the development server with `npm start` and use one of these two options; both of these achieve the same result.

- Make a `GET` request to `/api/debug/reset` with `curl http://localhost:8001/api/debug/reset`.
- Use the browser to navigate to `http://localhost:8001/api/debug/reset`.


## API
The resourses available are as follows.

### v 1.0
This is the version for demo purposes. 

#### Venues
- [x] Add
- [x] Update
- [x] Delete
- [x] List

A small set of venues in Calgary is available on the database.

#### Events
- [x] Add
- [x] Update
- [x] Delete
- [x] List
- [ ] Attendance report
- [ ] Finantial result

A fictional set of events is provided as example.

#### Users
- [x] Signup
- [x] Login
- [x] Update (endpoint)
- [ ] Profile
- [ ] Order history

#### Orders
- [x] Checkout
- [x] E-mail confirmation
- [X] Unique QR Code tickets by e-mail
- [ ] PDF tickets
- [ ] Export finantial data 

## To Do

The version published on April 2nd 2020 is a working MVD. At the moment, it is available only for educational purposes.
The following items will be completed to provide a full solution.

- [ ] API documentation
- [ ] Automated tests
- [ ] Admin front-end
- [ ] Scanning app
