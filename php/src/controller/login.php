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
    // FIXME: CHECK which path should be used. Actually GET on login/ is nice as well
    // FIXME: refactor this to a controller class
    // if (str_starts_with($apiPath, "/login/whoami")) {
    if (!empty($_SESSION['account'])) {
        $replyBody["loggedIn"] = true;
        $replyBody["account"] = $_SESSION['account'];
    } else {
        $replyBody["loggedIn"] = false;
    }
    // } else {
    //     throw new HttpStatusException("Not found", 404);

    // }
} elseif ($method === "POST") {
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
