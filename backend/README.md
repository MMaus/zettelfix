# Zettelfix Backend

This is the backend for Zettelfix application. It is mainly an authenticated CRUD store for named JSON objects.

## Starting the backend locally

### Prerequisites

To start the backend, you require

-   PHP >= 8.1 with the modules which are required for Lavavel (see Laravel documentation for details)
-   PHP composer >= 2.x
-   MySql >= 5.7.8 server running, with an empty database for this application. _Alternatively_, you can
    setup another database like SqLite if you have the corresponding PHP modules installed.

### Create .env file

Copy `.env.example` to `.env` and adapt it to the local needs.  
At the very least, you need to supply the correct database credentials for an empty MySQL database.  
If you prefer to choose another database, you can configure it there as well. Please refer to the Laravel documentation.

You should also set `APP_DEBUG=false`.

### Starting the backend

Then, you need to setup the following commands:

-   `composer install`
-   `php artisan migrate`
-   `php artisan serve`

## Preparation of deployment

If you plan to deploy the application, you need to create an adapted .env file for the deployment stage as well.
There, you need to adapt the database parameters as well.  
Note that you might also want to adapt the host etc.

The backend is installed from source. One option is to clone the repository initially at the destination, and `git pull` the
latest source before each installation.

# Functionality

The functionality should be provided via OpenAPI. This is work in progress on the TODO list (#45).

For now, the following routes exist (under context /api):

-   POST /auth/register: register new user
-   POST /auth/login : login (a bearer token is returned)
-   GET /bags : (protected) get all bags from user, might change to: get meta info for all bags (i.e. without content)
-   GET /bags/{name} : (protected) get a user's bag of a specific name, provides `ETag` and `Last-Modified` headers
-   PUT /bags/{name} : (protected) create or update a given bag for that user; supports `If-Match` header
-   DELETE /bags/{name} : (protected) delete one of the user's bags
-   POST /auth/logout : (protected) logout and invalidate the bearer token
-   GET /user : (protected) get user information

For details, issue a request and work with the error messages.
_protected_ routes require a bearer token, available at /auth/login)
