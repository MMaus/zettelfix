<?php

namespace migration;

class MigrationData {

    function __construct(protected string $fname, protected array $lines, protected string $checksum) {

    }

}


?>