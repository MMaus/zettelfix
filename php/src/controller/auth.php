<?php

require_once '../../php/src/repo/userRepo.php';

echo "Session ".session_id();

if (isset($_SESSION['user.email'])) {
    echo "user is known: ".$_SESSION['user.email'];
} else {
    echo "user is not known";
}

?>