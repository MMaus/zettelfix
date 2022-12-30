<?php
// used for login and logout purposes

// FIXME: Refactor to a SessionController!

use auth\AuthFilter;
use controller\exception\HttpStatusException;

$request = '';
$replyBody = array();
$method = "GET";
if ($_SERVER['REQUEST_METHOD'] === "POST") {
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
        global $authResult;
        if ($authResult->isAuthorized()) {
            $replyBody["loggedIn"] = true;
            $replyBody["account"] = $authResult->getAccount();
        } else {
            $replyBody["loggedIn"] = false;
        }
    }
} else if ($method === "POST") {
    $accountService = new \user\AccountService();
    global $subdomains;
    if (!empty($subdomains) && $subdomains[0] === "refreshToken") {
        $refreshToken = file_get_contents("php://input");
        $result = $accountService->createBearerToken($refreshToken);
        if ($result) {
            $replyBody['refreshToken'] = $result['refreshToken'];
            $replyBody['bearerToken'] = $result['bearerToken'];
            echo json_encode($replyBody);
        } else {
            http_response_code(401);
            echo "Invalid token!\n";
        }
        return;
    } else {

        $request = json_decode(file_get_contents("php://input"), true);
        $command = $request['command'];


        $requestOk = false;
        // FIXME: change api, use HTTP Headers instead of those weird custom command objects
        if ($command === "login") {
            $validation = $accountService->validateLogin($request["account"], $request["password"]);
            if ($validation) {
                $requestOk = true;
                $replyBody['refreshToken'] = $validation['refreshToken'];
                $replyBody['bearerToken'] = $validation['bearerToken'];
                // $oldSession = session_id();
                // session_regenerate_id();
                // $_SESSION['account'] = $request["account"];
                // $newSession = session_id();
            }
        } elseif ($command === "logout") {
            // FIXME: add proper logout functionality: invalidate tokens
            session_destroy();
            if (isset($_SESSION["account"])) {
                $requestOk = $accountService->logout($_SESSION["account"]);
            } else {
                $requestOk = false;
            }
            // session_regenerate_id();
        } elseif ($command === "register") {
            $requestOk = $accountService->registerAccount($request["account"], $request["password"]);
            if ($requestOk) {
                // session_regenerate_id();
                // $_SESSION['account'] = $request["account"];
            }
        } elseif ($command === "sendVerificationEmail") {
            // if ($_SESSION["account"] === $request["account"]) {

            $validation = (new AuthFilter())->validateRequest();
            if ($validation->isAuthorized()) {
                $requestOk = $accountService->sendVerificationEmail($validation->getAccount());
                if ($requestOk) {
                    // session_regenerate_id();
                    // $_SESSION['account'] = $request["account"];
                }
            } else {
                $requestOk = false;
            }
        } elseif ($command === "requestPasswordReset") {
            $requestOk = $accountService->sendPasswordResetEmail($request["account"]);
            $replyBody['result'] = "Password request has been sent via mail";
        } elseif ($command === "resetPassword") {
            // echo "setting new password for token " . $request["token"] . " to " . $request["password"];
            $requestOk = $accountService->resetPassword($request["token"], $request["password"]);
            $replyBody['result'] = "Password has been updated";
        } else {
            header("Bad request", true, 400);
        }

        if ($requestOk) {
            $replyBody['status'] = "OK";
        } else {
            $replyBody['status'] = "BAD";
        }
    }
}

// FIXME: reply only on controller level (approach: reply = model, rendering (json_encode) = view)
header('Content-type: application/json');
echo json_encode($replyBody);
