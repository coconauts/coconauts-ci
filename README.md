    Note: This project is a beta and it's not ready for a production environment.

# Coconauts CI

Coconauts CI is a lightweight Continuous integration software written on NodeJS

- Node.js and the [Express framework](http://expressjs.com/) for the backend
- JQuery for the frontend
- Powered by Redis

## Key features

- Simple 1-page only dashboard
- Execute tasks periodically
- Clone and update repositories from git (github , buitbucket, etc)
- Run projects without repository to execute tasks periodically.
- Slack integration using webhooks

## Install

Coconauts CI depends on `nodejs` and `redis` being installed
in your system. For debian-based distributions this can be achieved with:

    sudo apt-get install nodejs redis-server

Then clone this repository, and install the required node packages with:

    npm install

## Run

First run the server with:

    node app.js

Now you an access the client web interface on http://localhost:8590

Once it's running, click on the `+` button to start adding projects

## Configuration

Coconauts CI makes use of the `config.json` file.

Copy the config.json.sample file or rename it as `config.json` and configure
your port or slack webhook URL.

## Contribute

If you wish to contribute simply raise a pull request or open a ticket
to report any issues. Whatever your contribution it will be very welcome!
