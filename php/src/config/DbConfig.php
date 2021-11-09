<?php

namespace config;

class DbConfig {

    public string $host;
    public int $port;
    public string $db_name;
    public string $user;
    public string $password;


    function __construct(){ 
        $dbCfg = $GLOBALS["cfg"]["database"];
        
        $this->host = $dbCfg["host"];
        $this->port = $dbCfg["port"];
        $this->db_name = $dbCfg["db_name"];
        $this->user = $dbCfg["user"];
        $this->password = $dbCfg["password"];

    }

    function toString(): string {
        return  implode(":", array($this->host, $this->port,  $this->db_name, $this->user, substr(sha1($this->password), 0, 10)));
    }

    function setAuth(string $user, string $password): void {
        $this->user = $user;
        $this->password = $password;
    }


}


?>