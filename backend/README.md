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

### Starting the backend

Then, you need to setup the following commands:

-   `composer install`
-   `php artisan migrate`
-   `php artisan serve`

## Preparation of deployment

If you plan to deploy the application, you need to create an adapted .env file for the deployment stage as well.
There, you need to adapt the database parameters as well.  
Note that you might also want to adapt the host etc.
