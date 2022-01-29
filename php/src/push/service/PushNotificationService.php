<?php

namespace push\service;

use controller\exception\HttpStatusException;
use Doctrine\ORM\EntityManager;
use Exception;
use repo\model\PushRegistration;

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use user\AccountService;

class PushNotificationService {

    private const VAPID_FILE  = __DIR__ . "/../../../vapid.json";

    private EntityManager $entityManager;
    private array $vapid; // ["subject", "privateKey", "publicKey"]

    function __construct() {
        global $entityManager;
        $this->entityManager = $entityManager;
        if (!file_exists(self::VAPID_FILE)) {
            throw new Exception("Missing file 'vapid.json'");
        }
        $this->vapid = json_decode(file_get_contents(self::VAPID_FILE), true);
    }

    function getPublicKey() {
        return $this->vapid["publicKey"];
    }

    function sendNotifications(string $type) {
        // type is ignored for now
        // get a List of all Users, get all subscriptions
        // $entityManager->get()

        echo "Sending out some notes :P\n";

        $push = new WebPush(
            ["VAPID" => $this->vapid],
            ["TTL" => 12 * 3600]
        );


        $query = $this->entityManager->createQuery('SELECT r FROM \repo\model\PushRegistration r');
        $all_subscriptions = $query->getResult();

        $count = 0;
        foreach ($all_subscriptions as $subscription) {
            $count++;
            if ($count > 100) {
                // TODO support chunk notifications for multiple chunks
                echo "Maximum number of notifications reached";
                break;
            }
            $subData = Subscription::create([
                "endpoint" => $subscription->getEndpoint(),
                "contentEncoding" => "aesgcm",
                "authToken" => $subscription->getAuth(),
                "keys" => [
                    "p256dh" => $subscription->getP256DH(),
                    "auth" => $subscription->getAuth(),
                ]
            ]);
            $push->queueNotification($subData, "Show TODO");
        }
        foreach ($push->flush() as $i => $result) {
            if (!$result->isSuccess()) {
                // Push failed -> remove?
                echo "tentative issue with push!";
                if ($result->getResponse()->getStatusCode() == 410) {
                    // push failed definitively => remove??
                    echo "PUSH NOTIFICATION FAILED!";
                }
            } else {
                echo "Notification $i sent successfully!";
            }
        }


        return "ok";
    }

    function findRegistration(string $endpoint): ?PushRegistration {
        $query = $this->entityManager->createQuery('SELECT r FROM \repo\model\PushRegistration r WHERE r.endpoint = :endpoint');
        $query->setParameter('endpoint', $endpoint);
        return $query->getOneOrNullResult();
    }

    /**
     * returns true if the subscription was created, false otherwise (if subscription already exists)
     */
    function registerSubscription(string $account, string $jsonSubscription): bool {
        $accountService = new AccountService();
        $user = $accountService->getUser($account);
        if ($user == null) {
            throw new HttpStatusException("Bad request", 400);
        }
        echo "JSON:\n" . $jsonSubscription . "\n";
        $registration = new PushRegistration($user, $jsonSubscription);
        $presentRegistration = $this->findRegistration($registration->getEndpoint());
        if ($presentRegistration !== null) {
            echo "Registration found\n";
            return false;
        }
        echo "Registration NOT found\n";
        $user->getPushRegistrations()->add($registration);
        $this->entityManager->persist($registration);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        echo "Registration persisted, id= " . $registration->getSubscriptionId() . "\n";
        return true;
        return "OK";
    }
}
