# quantox-node

## Project setup
```
npm install
```

## Database setup
Setup database info in constants/db.const.json, then run

```
npm run init-db
```

to create and seed the initial database

## SMTP setup
Setup the SMTP server info in constants/mailer.const.json to be able to send mails on user registration

## Run the client
For the production build run

```
npm run client-build
```

and the development version is on

```
npm run client-dev
```

## Run the server
Similarly the server is run by

```
npm run server
```

for the production version, and

```
npm run server-dev
```

for the development version

## Run the app
```
Go to http://localhost:3000 for the production version or http://localhost:8080 for the development version
```
