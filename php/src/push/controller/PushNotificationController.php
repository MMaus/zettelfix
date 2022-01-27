<?php

namespace push\controller;

use controller\exception\HttpStatusException;
use \push\service\PushNotificationService;

class PushNotificationController {


    private PushNotificationService $pushNotificationService;

    function __construct() {
        $this->pushNotificationService = new PushNotificationService();
    }

    function processRequest(string $verb, array $pathSegments, string $requestBody): string {
        if ($verb === "POST") {
            if ($pathSegments[0] === "subscription") {
                $user = $_SESSION["account"];
                if (!isset($user) || empty($user)) {
                    throw new HttpStatusException("Authorization Required", 401);
                }
                $created = $this->pushNotificationService->registerSubscription($user, $requestBody);
                if ($created) {
                    return "Subscription created";
                }
                return "Subscription already present";
            } else if ($pathSegments[0] === "trigger") {
                global $cfg;
                if (json_decode($requestBody, true)["code"] === $cfg["app"]["cron_password"]) {
                    $this->pushNotificationService->sendNotifications("");
                    return "Sent";
                } else {
                    echo "Whopsie, password mismatch!\n";
                    throw new HttpStatusException("Forbidden", 403);
                }
            }
            throw new HttpStatusException("Not found", 404);
        } else if ($verb === "GET") {
            if ($pathSegments[0] === "vapid") {
                return $this->pushNotificationService->getPublicKey();
            }
            throw new HttpStatusException("Not found", 404);
        }
        throw new HttpStatusException("Method Not Allowed", 405);
    }
}
