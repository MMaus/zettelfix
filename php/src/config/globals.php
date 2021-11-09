<?php

// TODO replace this with some DI framework.
// For now, php-di 6 does not seem to be compatible with doctrine 2.10, and I need doctrine, so I'll stick with this for now

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;
use config\DbConfig;

function globals_create_em(DbConfig $dbConfig): EntityManager {
    $isDevMode = true;
    $proxyDir = null;
    $cache = null;
    $useSimpleAnnotationReader = false;
    $config = Setup::createAnnotationMetadataConfiguration(array(__DIR__."/src"), $isDevMode, $proxyDir, $cache, $useSimpleAnnotationReader);


    $conn = array(
      'driver' => 'pdo_mysql',
      'dbname' => $dbConfig->db_name,
      'user' => $dbConfig->user,
      'password' => $dbConfig->password,
      'host' => $dbConfig->host,
      'port' => $dbConfig->port

    );
    return EntityManager::create($conn, $config);
}

/**
 * @var \Doctrine\ORM\EntityManager
 */
$entityManager = globals_create_em(new DbConfig());

?>