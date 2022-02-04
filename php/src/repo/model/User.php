<?php

namespace repo\model;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
    // FIXME: 'account' , 'email' both refer to this
    private $account = "";

    /**
     * @ORM\Column(type="string")
     * @var string
     */
    private $name = "";

    /**
     * @ORM\Column(type="string", name="EMAIL_VERIFICATION_TOKEN"  )
     * @var string
     */
    private $emailVerificationToken = "";

    /**
     * @ORM\Column(type="boolean", name="EMAIL_VERIFIED"  )
     * @var bool
     */
    private $emailVerified = false;


    /**
     * @ORM\OneToMany(targetEntity="\repo\model\PushRegistration", 
     * mappedBy="user")
     * @var Collection
     */
    private $pushRegistrations;

    /**
     * @ORM\Column(type="string", name="password_hash")
     * @var string
     */
    private $passwordHash = "";

    public function __construct($account, $passwordHash) {
        $this->account = $account;
        $this->passwordHash = $passwordHash;
        $this->pushRegistrations = new ArrayCollection();
    }

    public function getAccount(): string {
        return $this->account;
    }

    public function getPasswordHash(): string {
        return $this->passwordHash;
    }

    public function getPushRegistrations(): Collection {
        return $this->pushRegistrations;
    }

    public function isEmailVerified(): bool {
        return $this->emailVerified;
    }

    public function setEmailVerified(bool $verified): void {
        $this->emailVerified = $verified;
    }

    public function getEmailVerificationToken(): string {
        return $this->emailVerificationToken;
    }

    public function setEmailVerificationToken(?string $token): void {
        $this->emailVerificationToken = $token;
    }

    public function jsonSerialize(): mixed {
        return [
            "account" => $this->account,
            "name" => $this->name,
            "emailVerified" => $this->emailVerified
        ];
    }
}
