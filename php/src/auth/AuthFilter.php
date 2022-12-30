<?php

namespace auth;

class AuthFilter {

    function validateRequest(): AuthResult {
        $headers = array_change_key_case(getallheaders(), CASE_LOWER);
        if (!key_exists("x-authorization", $headers)) {
            return new AuthResult(false, null);
        }
        $auth = $headers["x-authorization"];
        // echo "auth = $auth";
        [$authType, $authValue] = explode(" ", $auth, 2);
        if ($authType === "Bearer") {
            return $this->validateBearerToken($authValue);
        } else if ($authType === "Basic") {
            // For now: only service account login is supported
            global $cfg;
            $decoded = base64_decode($authValue);
            [$user, $password] = explode(":", $decoded, 2);
            $refPassword = $cfg['app']['service_db_password'];
            $refUser = "service_db";
            if ($user == $refUser && $password == $refPassword) {
                return new AuthResult(true, "service_db");
            }
            if ($user == "cron" && $password == $cfg['app']['cron_password']) {
                return new AuthResult(true, "cron");
            }
            // This is a login; handled in a later feature
            die("Basic Auth for regular accounts not supported");
        }
        die("Unsupported Authentication method $authType");
        return new AuthResult(false, null);
    }

    private function validateBearerToken(string $token): AuthResult {
        global $entityManager;

        $query = $entityManager->createQuery('SELECT t.expiryTime, u.account from \repo\model\BearerToken t
        JOIN t.user u  WHERE t.tokenValue = :token ');
        $query->setParameter("token", $token);
        $result = $query->getOneOrNullResult();
        if (!$result) {
            return new AuthResult(false, null);
        }
        $account = $result['account'];
        // FIXME:  Validate expiry time, delete token if expired (or have a cron job for that?)
        $authResult = new AuthResult(true, $account);
        return $authResult;


        // BELOW: First lines of code of how to use the session to store this stuff
        // Actually, the session would only be nice for caching, if not every request should hit the DB
        // if (session_id() == '' || !isset($_SESSION) || session_status() === PHP_SESSION_NONE) {
        //     session_start();
        // }
        // if (key_exists('bearer', $_SESSION) && key_exists('bearer_expiry', $_SESSION)) {
        //     if ($_SESSION['bearer'] !== $token) {
        //         return new AuthResult(false, null);
        //     }
        //     $expiryTime = unserialize(base64_decode($_SESSION['bearer_expiry']));
        //     if (new \DateTime("now") > $expiryTime) {
        //         return new AuthResult(false, null);
        //     }
        //     // session is authenticated
        // }
        // if (key_exists('account', $_SESSION)) {
        //     // account is associated with session
        // }
        // if (session_)

        //     return null;
    }


    function requestToken(): string {
        die("not yet implemented");
    }
}
