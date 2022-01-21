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
     * @ORM\Column(type="integer", name="REG_ID")
     * @var int
     */
    private $id;

    /**
     * Many PushRegistrations may belong to one User.
     * @ORM\ManyToOne(targetEntity="\repo\model\User")
     * @ORM\JoinColumn(name="USER_ID", referencedColumnName="id")
     * @var User
     */
    private $user;

    /**
     * @ORM\Column(type="string", name="REGISTRATION_JSON")
     * @var string
     */
    private $json = "";

    public function __construct($user, $json) {
        $this->user = $user;
        $this->json = $json;
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

    public function jsonSerialize(): mixed {
        return [
            "user" => $this->user,
            "json" => $this->json,
        ];
    }
}
