<?php

namespace controller\exception;

use \Exception;

class HttpStatusException extends Exception {
  // Die Exception neu definieren, damit die Mitteilung nicht optional ist
  public function __construct($message, $code = 0, \Throwable $previous = null) {
    // etwas Code

    // sicherstellen, dass alles korrekt zugewiesen wird
    parent::__construct($message, $code, $previous);
}

// benutzerdefinierte Stringdarstellung des Objektes
public function __toString() {
    return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
}

}


?>