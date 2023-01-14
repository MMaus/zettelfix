# Zettelfix

This project is a hobby project for self organisation (like shopping lists), published at https://zettelfix.de.

It uses a PHP backend and Vue3 frontend.

Note: there are subproject README.mds:

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)

# News

2023 01 06: The project is alive, again. There is a major rewrite ongoing. This rewrite will most likely be a breaking change, that is, existing data will be discarded. Some of the major new features are:

- brand new shopping cart experience: multiple shops supported
- technical rewrite backend: Laravel (improved user management and security)
- technical rewrite frontend: removing leftovers from Jutebag (predecessor project), migration to vue3

2022 03 11: Sorry that this project is pausing for now...  
I just switched my attention to another project, which is ML (no github repo in the near future - just getting started).  
The current state of this project is far from finished, not even close to an alpha version. Despite being deployed at zettelfix.de and used regularly by me, I consider it still as experimental draft - my TODO list just for this project is overwhelming, and although I enjoy improving this, I also want to progress on my other projects - so this may become a dead end street.  
Sorry for this.

# Run locally

## Prerequisites:

- PHP 8.1 with several modules (refer to Laravel documentation)
- PHP Composer 2.x
- Node 16.x

## Starting the application

**TODO**

In short:

- maybe: read "Installation" section first
- READ THE BACKEND SETUP README BEFORE TO DO THE DATABASE MIGRATIONS!
- cd into `backend`
- install the backend: `composer install`
- start backend with `php artisan serve`
- cd into `frontend`
- install the frontend: `npm install`
- run the frontend: `npm run serve`

That's it, you can now use the app on the URL which `npm run serve` shows you.

# Generation of vapid.json with VAPID Keys

In order to provide web push notifications, you need VAPID keys.
A simple way to generate them is to use the web-push package for npm:

> sudo npm i -g web-push
> web-push generate-vapid-keys --json > vapid.json

This will create a public / private VAPID key pair.

You then need to _EDIT_ this file and add the key "subject", which contains the URL of your host or a `mailto:your@ema.il` mail link.

# Installation

## Building the backend

The backend is

## Configuring apache2

**THIS SECTION IS DEPRECATED**

mod_rewrite needs to be enabled; consult the web to see how.

.htaccess files must be allowed to overwrite rules; consult the web to see how.
TODO: attach sample config

the .htaccess-file

COPY api/ into public/api at after npm build

Project name: joote.net
