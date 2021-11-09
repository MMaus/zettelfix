<?php

namespace repo\model;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * @ORM\Entity()
 * @ORM\Table("USERS")
 */
class User implements JsonSerializable {

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @var int
     *  */
    private int $id;

    /**
     * @ORM\Column(type="string", name="email")
     * @var string
     */
    // FIXME: 'account' , 'email' and 'username' all refer to this, but not to 'name'.. UNIFY to 'account'
    private $account = "";

    /**
     * @ORM\Column(type="string")
     * @var string
     */
    private $name = "";

    /**
     * @ORM\Column(type="string", name="password_hash")
     * @var string
     */
    private $passwordHash = "";

    public function __construct($account, $passwordHash) {
        $this->account = $account;
        $this->passwordHash = $passwordHash;
    }

    public function getAccount(): string {
        return $this->account;
    }

    public function getPasswordHash(): string {
        return $this->passwordHash;
    }

    public function jsonSerialize(): mixed {
        return [
            "account" => $this->account,
            "name" => $this->name,
        ];
    }
}
