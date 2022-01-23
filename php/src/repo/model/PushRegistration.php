<?php

namespace repo\model;

use \repo\model\User;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * @ORM\Entity()
 * @ORM\Table("PUSH_REGISTRATION")
 */

class PushRegistration implements JsonSerializable {

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer", name="ID")
     * @var int
     */
    private $id;

    /**
     * @ORM\Column(type="string", name="REGISTRATION_JSON")
     * @var string
     */
    private $json = "";

    /**
     * @ORM\Column(name="ENDPOINT")
     * @var string
     */
    private $endpoint = "";

    /**
     * @ORM\Column(name="SUBSCRIPTION_ID")
     * @var string
     */
    private $subscriptionId = "";

    /**
     * @ORM\Column(name="AUTH_TOKEN")
     * @var string
     */
    private $auth = "";

    /**
     * @ORM\Column(name="PUBLIC_KEY")
     * @var string
     */
    private $p256dh = "";

    /**
     * Many PushRegistrations may belong to one User.
     * @ORM\ManyToOne(targetEntity="\repo\model\User")
     * @ORM\JoinColumn(name="USER_ID", referencedColumnName="id")
     * @var User
     */
    private $user;


    public function __construct($user, $json) {
        $this->user = $user;
        $this->json = $json;
        $parsedObject = json_decode($json);
        $this->auth = $parsedObject->keys->auth;
        $this->p256dh = $parsedObject->keys->p256dh;
        $this->endpoint = $parsedObject->endpoint;
        if (property_exists($parsedObject, "subscriptionId")) {
            $this->subscriptionId = $parsedObject->subscriptionId;
        }
    }

    public function setJson(string $json): void {
        $this->json = $json;
    }

    public function getJson(): string {
        return $this->json;
    }

    public function getUser(): user {
        return $this->user;
    }

    public function getP256dh() {
        return $this->p256dh;
    }

    public function getAuth() {
        return $this->auth;
    }

    public function getEndpoint() {
        return $this->endpoint;
    }

    public function getSubscriptionId() {
        return $this->subscriptionId;
    }


    public function jsonSerialize(): mixed {
        return [
            "user" => $this->user,
            "json" => $this->json,
            "subscriptionId" => $this->subscriptionId,
        ];
    }
}
