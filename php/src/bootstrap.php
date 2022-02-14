<?php

/**
 * The (actual) bootstrap file. This is the deferred entry point, which is included from index.php
 *
 * This file is the entry point for all API requests.
 * In production, it's the only accessible php file from the server; all requests \
 * to /api/ are rewritten to call this php script.
 *
 * To enable this, the webserver has to be configured accordingly; for Apache this is
 * achieved via the accompanying .htaccess file.
 *
 * In production, the directory structure is slightly different from the source:
 *
 * source:
 * api/index.php
 * php/src/...
 *
 * production:
 * public/api/index.php      <-- public/ is the webroot folder.
 * php/src/...
 *
 */

// FIXME: don't introduce unnecessary globals here!
$cfg = parse_ini_file(__DIR__ . '/../zettelfix.ini', true);

$debugConfig = $cfg["debug"];

ini_set('display_errors', $debugConfig["display_errors"]);
ini_set('display_startup_errors', $debugConfig["display_startup_errors"]);
ini_set('log_errors', $debugConfig["log_errors"]);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/config/globals.php';
require_once __DIR__ . "/session.php";

// require_once 'controller/exception/HttpStatusException.php';

use controller\ClobStorageController;
use \controller\exception\HttpStatusException;
use \push\controller\PushNotificationController;
use \auth\AuthFilter;
use auth\AuthResult;

$API_URL = $cfg['api']['api_base_url'];

// TODO: potentially use ob_start() here!


// FIXMEL Use introduce something like Spring's filter chain here
// ... or chack if there is a framework (Laravel? Symphony?) which already
// provides this.


// FIXME: define API somewhere properly (something like PACT?)

// FIXME: create UrlParser object, at least use unset() to clean up vars
$request = parse_url($_SERVER['REQUEST_URI']);
$fullPath = $request['path'];

$apiPath = "";
if (str_starts_with($fullPath, $API_URL)) {
    $apiPath = substr($fullPath, strlen($API_URL));
} else {
    die("Illegal API: fullUrl=$fullPath, API_BASE_URL=$API_URL => not matching");
}

if (str_starts_with($apiPath, "/")) {
    $apiPath = substr($apiPath, 1);
}
$apiPathSegments = explode("/", $apiPath);
$domain = $apiPathSegments[0];
$subdomains = array_slice($apiPathSegments, 1);
$verb = $_SERVER['REQUEST_METHOD'];
// FIXME: run authentication
// FIXME: refactor globals. Create $applicationContext global.


// No authorization required for the login path




$requestBody = file_get_contents("php://input");
if (empty($requestBody)) {
    $requestBody = '';
}
$authResult = (new AuthFilter())->validateRequest();
try {
    if (empty($domain)) {
        echo "no domain found in $fullPath -$apiPath - $domain";
        throw new HttpStatusException("Not found", 404);
    }
    // No Auth required to log in :)
    if ($domain === 'login') {
        require_once __DIR__ . "/controller/login.php";
        return;
    }

    // all other domains need an authorized user
    // FIXME: separate auth from domain logic; maybe introduce roles
    // FIXME: call controller objects here!
    switch ($domain) {
        case 'migrate_db':
            if (!$authResult->isAuthorized()) {
                throw new HttpStatusException("Authorization required");
            }
            require_once __DIR__ . "/controller/migrate_db.php";
            break;
        case 'push':
            // FIXME: Return proper HTTP Reponse Object
            $controller = new PushNotificationController();
            $response = $controller->processRequest($verb, $subdomains, $requestBody);
            echo $response;
            // echo "OK";
            break;

        case 'clob-storage':
            if (!$authResult->isAuthorized()) {
                throw new HttpStatusException("Authorization required");
            }
            $controller = new ClobStorageController();
            $response = $controller->processRequest($verb, $subdomains, $requestBody);
            echo json_encode($response);
            break;
            // require_once __DIR__ . "/controller/clob-storage.php";
        default:
            throw new HttpStatusException("Not found", 404);
    }
} catch (HttpStatusException $e) {
    // FIXME: if $e->getCode() === 401 then add WWW-Authenticate headerfoo bar
    if ($e->getCode() === 401) {
        http_response_code(401);
        header("WWW-Authenticate: Basic; realm='zettelfix.de'");
        echo "Authentication required";
        return;
    }
    http_response_code($e->getCode());
    echo $e->getMessage();
}
