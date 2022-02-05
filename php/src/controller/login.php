<?php
// used for login and logout purposes

// FIXME: Refactor to a SessionController!

use controller\exception\HttpStatusException;

$request = '';
$replyBody = array();
$method = "GET";
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $request = json_decode(file_get_contents("php://input"), true);
    $method = "POST";
} elseif ($_SERVER['REQUEST_METHOD'] != "GET") {
    throw new HttpStatusException("Method not allowed", 405);
}

if ($method === "GET") {
    // FIXME: refactor this to a controller class
    // if (str_starts_with($apiPath, "/login/whoami")) {
    // FIXME: use Path elements in /login/, e.g. /login/verifyEmail
    if (array_key_exists("emailVerificationToken", $_GET) && $_GET['emailVerificationToken']) {
        $accountService = new \user\AccountService();
        $ok = $accountService->verifyEmail($_GET['emailVerificationToken']);
        $replyBody['status'] = $ok ? 'OK' : 'BAD';
        // FIXME: add HTTP forward to login or success notification page, or just include it here! :)
    } else {
        if (!empty($_SESSION['account'])) {
            $replyBody["loggedIn"] = true;
            $replyBody["account"] = $_SESSION['account'];
        } else {
            $replyBody["loggedIn"] = false;
        }
    }
} else if ($method === "POST") {
    $command = $request['command'];

    $accountService = new \user\AccountService();

    $requestOk = false;
    if ($command === "login") {
        $requestOk = $accountService->loginValid($request["account"], $request["password"]);
        if ($requestOk) {
            $oldSession = session_id();
            session_regenerate_id();
            $_SESSION['account'] = $request["account"];
            $newSession = session_id();
        }
    } elseif ($command === "logout") {
        session_destroy();
        if (isset($_SESSION["account"])) {
            $requestOk = $accountService->logout($_SESSION["account"]);
        } else {
            $requestOk = false;
        }
        session_regenerate_id();
    } elseif ($command === "register") {
        $requestOk = $accountService->registerAccount($request["account"], $request["password"]);
        if ($requestOk) {
            session_regenerate_id();
            $_SESSION['account'] = $request["account"];
        }
    } elseif ($command === "sendVerificationEmail") {
        if ($_SESSION["account"] === $request["account"]) {
            $requestOk = $accountService->sendVerificationEmail($request["account"]);
            if ($requestOk) {
                session_regenerate_id();
                $_SESSION['account'] = $request["account"];
            }
        } else {
            $requestOk = false;
        }
    } elseif ($command === "requestPasswordReset") {
        // die("foo bar IST POST, REQUEST" . $command);
        $replyBody['result'] = "Password request has been sent via mail";
    } elseif ($command === "resetPassword") {
        echo "setting new password for token " . $request["token"] . " to " . $request["password"];
        $replyBody['result'] = "Password has been updated";
        $requestOk = true;
    } else {
        header("Bad request", true, 400);
    }

    if ($requestOk) {
        $replyBody['status'] = "OK";
    } else {
        $replyBody['status'] = "BAD";
    }
}

// FIXME: reply only on controller level (approach: reply = model, rendering (json_encode) = view)
header('Content-type: application/json');
echo json_encode($replyBody);
