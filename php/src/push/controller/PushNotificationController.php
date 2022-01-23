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
                // FIXME: actually, this also should be a POST, but then the registrations must have a distinct path
                // technically, we might trigger only some parts, e.g. all "TODO"s
                $this->pushNotificationService->sendNotifications("");
                return "Sent";
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
