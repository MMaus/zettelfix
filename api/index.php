<?php

/** 
 * The entry file.
 * 
 * This file is the entry point for all API requests.
 * In production, it's the only accessible php file from the server; all requests 
 * to /api/<some>/<path> are rewritten to call this php script.
 * 
 * To enable this, the webserver's rewriting has to be configured accordingly.
 * For Apache this is achieved via the accompanying .htaccess file.
 * 
 * In production, you might have to adapt the PHP_SRC relative path.
 * This file is configured for the following setup
 * 
 * production (server):
 * public/api/index.php      <-- public/ is the webroot folder.
 * php/src/...
 * 
 * source code structure:
 * api/index.php
 * php/src/...
 * 
 */


define('PHP_SRC', '../../php/src/');


require_once PHP_SRC.'bootstrap.php';

?>