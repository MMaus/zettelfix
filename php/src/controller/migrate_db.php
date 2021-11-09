<?php

$post = json_decode(file_get_contents("php://input"), true);

$controller = new \controller\MigrationController();

$controller->runMigrations();


?>