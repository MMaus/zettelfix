<?php

namespace migration;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table("db_migrations")
 */
class DbMigration {
    
    static function fromFileContent($fileName, $fileContent): DbMigration {
        $fileNameParts = explode(DIRECTORY_SEPARATOR, $fileName);
        $fname = end($fileNameParts);
        $fileContentStripped = preg_replace('/\s+/', '', $fileContent);
        $fhash = sha1($fileContentStripped);
        $dbMigration = new DbMigration();
        $dbMigration->setFName($fname);
        $dbMigration->setFHash($fhash);
        $dbMigration->setSql($fileContent);
        return $dbMigration;
    }

    /**
     * @ORM\Column(type="string")
     * @var string
     */
    private string $fname = '';


    /**
     * @ORM\Column(type="string")
     * @var string
     */
    private string $fhash = '';

    // FIXME: Read the doc on GeneratedValue, might require (strategy=...???)
    // https://www.doctrine-project.org/projects/doctrine-orm/en/2.9/reference/annotations-reference.html#annref_generatedvalue

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer", name="migration_id")
     * @var int
     */
    private int $migrationId;

    private string $sql = '';

    function getSql() {
        return $this->sql;
    }

    function setSql($sql) {
        $this->sql = $sql;
    }
    

    function setFName(string $fname): void{
        $this->fname = $fname;
    }

    function getFName(): string {
        return $this->fname;
    }


    function setFHash(string $fhash): void{
        $this->fhash = $fhash;
    }

    function getFHash(): string {
        return $this->fhash;
    }

    function getMigrationId(): int {
        return $this->migrationId;
    }




}
