<?php

namespace repo\model;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * @ORM\Entity()
 * @ORM\Table("GENERIC_CLOB")
 */

class ClobStorageObject implements JsonSerializable {

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer", name="CLOB_ID")
     * @var int
     */
    private $id;

    /**
     * Many CLOB may belong to one User.
     * @ORM\ManyToOne(targetEntity="\repo\model\User")
     * @ORM\JoinColumn(name="USER_ID", referencedColumnName="id")
     */
    private $user;

    /**
     * @ORM\Column(type="string", name="CLOB_KEY")
     * @var string
     */
    private $key = "";


    /**
     * @ORM\Column(type="integer", name="RECENT_VERSION")
     * @var int
     */
    private $version;

    /**
     * @ORM\Column(type="text", name="CONTENT")
     * @var string
     */
    private $content;

    public function __construct($user, $key, $content) {
        $this->user = $user;
        $this->key = $key;
        $this->content = $content;
        $this->version = 1;
    }

    public  function setContent(string $content): void {
        $this->content = $content;
        $this->version = $this->version + 1;
    }

    public  function getContent(): string {
        return $this->content;
    }

    public  function getVersion(): int {
        return $this->int;
    }

    public function jsonSerialize(): mixed {
        return [
            "key" => $this->key,
            "user" => $this->user,
            "content" => $this->content,
            "version" => $this->version
        ];
    }
}
