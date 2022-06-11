# Blog Server

Part of my **Blog API** project for [The Odin Project](https://www.theodinproject.com/about)

## Summary

A secure API server for two different clients: a "Reader" and an "Authoring Platform". This server is written in TypeScript, built using Node and Express, and connects to a MongoDB database.

[See the repo for the web client.](https://github.com/isaiahaiasi/blog-client)

## Features

- Authentication via JSON Web Tokens.
- Validation via the express-validator library.
- Mongoose Schemas for the User, Post, and Comment data models.
- Routes that utilize modern async/Promise patterns, as opposed to callbacks.

(Coming soon)

- Authorization roles (user, admin) and rules (any, same-user, admin, same-user-or-admin).
- Enhanced security using Refresh Tokens.
- Ability to "like" a post, and view a user's liked posts.

## Technologies used

- Docker
- TypeScript
- NodeJS
- Express
- MongoDB
- Mongoose
- ESLint
- bcrypt
- passportJS
- Jest

## Getting Started

### Installation

First, fork and clone the repo. Then, in the project directory, run:

```sh
npm install
```

### Set up

You will need a connection to a MongoDB database in order to run the API server.

You will also need to create a `.env` file in the root directory, and include the following environment variables:

- PORT: the port the server will run on (default is 3000).
- MONGODB_URI: the connection uri to your mongoDB database.
- JWT_SECRET: the secret used to encrypt user passwords.
- ALLOWED_ORIGINS: the incoming urls to allow with CORS.

`blog-server/.env`

```
PORT=3000
MONGODB_URI=http://localhost:8080/username:password/db
JWT_SECRET=cats
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Building

This project is built using TypeScript, which means it needs to be compiled before you can run it. To build the project, run:

`npm run build`

### Running

The repo contains a Make file with a command to create a server instance using Docker-Compose.

To start a production server with Docker, run:

`make up-prod`

To start a development server with Docker, run:

`make up`

If you do not wish to use docker, you can run the server with Node directly using:

`npm run start`
