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

# Deployment overview:

The main directory, that is, the root path of the exposed server, should point to the backend, that is, to
the `backend/public` folder. The frontend build should be copied there during the deployment process.

**NOTE** The current version is only suitable for "root path" deployments, i.e.:

- `myhost.com/` is supported
- `myhost.com/zettelfix` is _not_ supported

The base path of the server should be set to `backend/public`

- First, deploy the backend as described in the [Backend Readme](backend/README.md)
- Then build the frontend (see below or) [Frontend Readme](frontend/README.md)
- Copy the deployment artifacts (`frontend/dist`) into `backend/public`

## Prepare the host (strato)

_NOTE_ The github workflow in this repository uses the remote command `php-cli` where you would typically use `php`, e.g
instead of `php artisan migrate` use `php-cli artisan migrate`.

It turned out to have the following settings and aliases configured for ssh:

```
// file: ~/.bashrc

f [ -z "$PS1" ]; then
  shopt -s expand_aliases
fi

# adapt this to the path of your PHP (php-cli), and adapt the path where you put
# composer.phar (see https://getcomposer.org )
alias composer='/opt/RZphp81/bin/php-cli ~/composer/composer.phar'
alias php-cli='/opt/RZphp81/bin/php-cli'

# Those are for convenience and not required
shopt -s dotglob
alias ls='ls -l --color=auto'
PS1='hm10.net@strato:\w$ '
LS_COLORS=$LS_COLORS:'di=1;33:ln=36' ; export LS_COLORS

```

```
// file: ~/.bash_profile

if [ -f ~/.bashrc ]; then
  . ~/.bashrc
fi

```

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
