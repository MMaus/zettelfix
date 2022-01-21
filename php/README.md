# Installation

PHP Composer is required to run this program.

To set the application up, run

> composer install

## Generation of VAPID Keys

In order to provide web push notifications, you need VAPID keys.
A simple way to generate them is to use the web-push package for npm:

> sudo npm i -g web-push
> web-push generate-vapid-keys --json > vapid.json

This will create a public / private VAPID key pair.
