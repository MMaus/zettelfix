# Zettelfix.de

# Frontend

This is the frontend project for zettelfix.de.

# NEWS

Nov 08, 2021: The project is now moving towards another hosting solution.

2. April 2021: Right now, my motivation dropped significantly. This is mostly
   due to a lack of time, very similar tasks at work and a raising interest in
   the field of ML.

Thus, the work here is currently quite pragmatic, i.e. focussed on achieving
results rather quickly than properly.

## Build & Deploy

### Backend: Migrations

To setup the database, you have to query (i.e. GET) <host>/api/migrate_db .
The proper database migration tool doctrine-migrate unfortunately does not work
with my current hosting provider, so I had to implement this custom solution.

### Additional Requirement: node-sass

On my system, I needed to install node-sass globally
(> sudo npm install -g node-sass)

npm run build

Deployment is changing, workflow under development.

## unit tests

Note: components should be created using createComponent({}) instead of exporting the default config object

## Project setup

note: also required to get development started

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

Note: this will run the development server on 8088, _not_ on 8080!

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
