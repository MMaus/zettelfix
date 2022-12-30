<?php

namespace migration;

class MigrationsProvider {

    const SCRIPT_PATH = __DIR__.'/../../db/migration';

    /**
     * @return DbMigration[]
     */
    function getMigrations(): array {
        $result = [];
        $fileNames = array_diff(scandir(self::SCRIPT_PATH), array('.', '..'));
        foreach($fileNames as $fname) {
            $sql = file_get_contents(self::SCRIPT_PATH.DIRECTORY_SEPARATOR.$fname);
            array_push($result, DbMigration::fromFileContent($fname, $sql));
        }
        return $result;
    }



}

?>
