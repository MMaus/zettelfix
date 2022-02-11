<?php

namespace repo\model;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * @ORM\Entity()
 * @ORM\Table("REFRESH_TOKEN")
 */
class RefreshToken implements JsonSerializable {

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer", name="TOKEN_ID")
     * @var int
     */
    private $id;

    /**
     * A User may have many Refresh tokens
     * @ORM\ManyToOne(targetEntity="\repo\model\User")
     * @ORM\JoinColumn(name="USER_ID", referencedColumnName="id")
     */
    private $user;


    /**
     * @ORM\Column(type="text", name="TOKEN_VALUE")
     * @var string
     */
    private $tokenValue;

    function setTokenValue(string $tokenValue): void {
        $this->tokenValue = $tokenValue;
    }

    function getTokenValue(): string {
        return $this->tokenValue;
    }

    function setUser(User $user): void {
        $this->user = $user;
    }

    function getUser(): User {
        return $this->user;
    }

    /**
     * @ORM\Column(type="datetime", name="EXPIRY_TIME")
     * @var object
     */
    private $expiryTime;

    public function jsonSerialize(): mixed {
        return [
            "tokenValue" => $this->tokenValue,
        ];
    }
}
