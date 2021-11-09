<?php

namespace migration;
use config\DbConfig;
use PDOException;
use PDO;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;
use \repo\User;


// actually not a DAO, but refactoring with my current setup ain-t easy
class MigrationsDAO {
  // see https://wiki.selfhtml.org/wiki/PHP/Tutorials/Umstieg_von_der_veralteten_MySQL-API#PDO_.28MySQL.29
  // FURTHERMORE: checkout PHP Eloquent

  private PDO $pdo;


  const QUERY_CREATE_TABLE = "
    CREATE TABLE IF NOT EXISTS db_migrations(
      fname varchar(255) NOT NULL,
      fhash varchar(255) NOT NULL,
      migration_id int NOT NULL AUTO_INCREMENT,
      PRIMARY KEY (migration_id)
    );
  ";  

  function __construct(protected DbConfig $dbConfig) {
    // from https://phpdelusions.net/pdo
    $dsn = "mysql:host={$dbConfig->host};dbname={$dbConfig->db_name};charset=utf8mb4";
    $options = [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => true,
  ];

    try {
      $this->pdo = new PDO($dsn, $dbConfig->user, $dbConfig->password, $options);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage(), $e->getCode());
    }

    // init DB if not exists
    $this->pdo->query(self::QUERY_CREATE_TABLE);

  }

  /**
   * @return DbMigration[]
   */
  function getMigrations(): array {
    global $entityManager;

        $query = $entityManager->createQuery(
            'SELECT m
            FROM migration\DbMigration m
            ORDER BY m.migrationId ASC'
        ); //->setParameter('price', $price);
    
        return $query->getResult();
  }

  function executeMigration(DbMigration $migration) {
    global $entityManager;
    $sql = $migration->getSql();
    $statement = $this->pdo->prepare($sql);
    $statement->execute();
    while ($statement->nextRowset()) {/* https://bugs.php.net/bug.php?id=61613 */};
    $entityManager->persist($migration);
    $entityManager->flush();
  }

  function test_doctrine() {
    global $entityManager;
    $result = $entityManager->find("repo\User", 1);
    echo "USERNAME is {$result->getUsername()}\n";

    $migrationsRepository = $entityManager->getRepository("migration\DbMigration");
    $allMigrations = $migrationsRepository->findAll();
    echo "ALL MIGRATIONS ARE: {".sizeof($allMigrations)."}";
    $testMigration = new DbMigration();
    $testMigration->setFHash("123");
    $testMigration->setFName("01abc");
    $entityManager->persist($testMigration);
    $entityManager->flush();
    $allMigrations = $migrationsRepository->findAll();
    echo "ALL MIGRATIONS ARE: {".sizeof($allMigrations)."}";

  }


  function showConfig() {
    echo "showing config\n";
    echo $this->dbConfig->toString();

  }


}
?>