# Blog Server

Part of my **Blog API** project for [The Odin Project](https://www.theodinproject.com/about)

## Summary

A secure API server for two different clients: a "Reader" and an "Authoring Platform". This server is written in TypeScript, built using Node and Express, and connects to a MongoDB database.

[See the repo for the Reader.](https://github.com/isaiahaiasi/blog-reader)

[See the repo for the Authoring Client.](https://github.com/isaiahaiasi/blog-writer)

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

- TypeScript
- Node
- Express
- Webpack
- Mongoose
- ESLint
- bcrypt
- passportJS

## Running locally (**not finalized**)

You will need a connection to a MongoDB database in order to run the API server.

First, fork and clone the repo. Then, in the project directory, run:

```sh
npm install
```

You will need to set the following environment variables:

- PORT: the port the server will run on (default is 3000).
- MONGODB_URI: the connection uri to your mongoDB database.
- JWT_SECRET: the secret used to encrypt user passwords.

These can be written to a `.env` file in the root of the project directory Example:

`blog-server/.env`

```
PORT=3000
MONGODB_URI=http://localhost:8080/username:password/db
JWT_SECRET=cats
```

TODO: final build instructions (not finalized)
