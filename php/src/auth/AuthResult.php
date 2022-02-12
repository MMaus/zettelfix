<?php

namespace auth;

class AuthResult {

    private bool $isAuthorized;
    private ?string $account;


    function __construct(bool $authorized, ?string $account) {
        $this->isAuthorized = $authorized;
        $this->account = $account;
    }

    function isAuthorized(): bool {
        return $this->isAuthorized;
    }

    function getAccount(): ?string {
        return $this->account;
    }
}
