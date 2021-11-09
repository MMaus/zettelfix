<?php
namespace controller;

use \config;
use Exception;
use \migration;
use migration\DbMigration;
use migration\MigrationsDAO;
use migration\MigrationsProvider;

class MigrationController {

    private MigrationsProvider $migrationProvider;
    private MigrationsDAO $migrationDAO;

    function __construct() {
        $cfg = new config\DbConfig();
        $this->migrationProvider = new migration\MigrationsProvider();
        $this->migrationDAO = new migration\MigrationsDAO($cfg);
    }

    function runMigrations() {
        $migrationsDB = $this->migrationDAO->getMigrations();
        $migrationsFS = $this->migrationProvider->getMigrations();
        
        echo "================== Migrations from DB\n";
        foreach ($migrationsDB as $migration) {
            $fName = $migration->getFName();
            $fHash = $migration->getFHash();
            echo " - $fName : $fHash \n";
        }
        echo "================== Migrations from FS\n";
        foreach ($migrationsFS as $migration) {
            $fName = $migration->getFName();
            $fHash = $migration->getFHash();
            echo " - $fName : $fHash \n";
        }
        // find unmatched migrations
        $unmatchedMigrations = array();
        foreach($migrationsFS as $migration) {
            $fName = $migration->getFName();
            $fHash = $migration->getFHash();
            if (self::containsMigration($migrationsDB, $migration)) {
                echo "FOUND IN DB: $fName ($fHash)\n";
            }
            else {
                echo "NOT FOUND IN DB: $fName\n";
                $unmatchedMigrations[] = $migration;
            }
        }
        foreach($unmatchedMigrations as $migration) {
            $fName = $migration->getFName();
            $fHash = $migration->getFHash();
            echo "unmatched Migration: $fName\n";
        }
        foreach($unmatchedMigrations as $migration) {
            $fName = $migration->getFName();
            echo "running migration: $fName\n";
            $this->migrationDAO->executeMigration($migration);
            echo "    [OK]\n";
        }

    }

    static function containsMigration(array $dbMigrations, DbMigration $fsMigration): bool{
        $matches = array_filter($dbMigrations, fn($v) => 
            $v->getFName() == $fsMigration->getFName() && $v->getFHash() == $fsMigration->getFHash()
        );
        $semiMatches = array_filter($dbMigrations, fn($v) => 
            $v->getFName() == $fsMigration->getFName() xor $v->getFHash() == $fsMigration->getFHash()
        );
        // NOTE: this condition might be too strict, since empty files will have the same hash.
        // Note sure if empty migrations will ever be valid, so leaving this for now...
        if (sizeof($semiMatches) > 0) {
            $name = $semiMatches[0]->getFName();
            throw new Exception("Migration $name was applied but with different hash or filename!");
        }
        return sizeof($matches) > 0;

    }



    

}
