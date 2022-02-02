<?php

namespace user;

use Doctrine\ORM\EntityManager;
use \repo\model\User;

// FIXME: make proper constraints on account, e.g. email must be provided, email verification, ...
class AccountService {


    private EntityManager $entityManager;

    function __construct() {
        global $entityManager;
        $this->entityManager = $entityManager;
    }

    function getUser(string $account): User {
        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.account = :account');
        $query->setParameter('account', $account);
        $user = $query->getOneOrNullResult();
        return $user;
    }

    function loginValid(string $account, string $password): bool {
        // get_user
        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.account = :account');
        $query->setParameter('account', $account);
        $user = $query->getOneOrNullResult();
        if ($user == null) {
            return false;
        }
        if (!password_verify($password, $user->getPasswordHash())) {
            return false;
        }
        return true;
    }

    function registerAccount(string $rawUsername, string $password): bool {
        global $cfg;
        $username = trim($rawUsername);
        if (!preg_match("/^\S+@\S+\.\S+$/", $username)) {
            echo "Illegal Email / user name :P (schema: foo@bar.com)"; // FIXME:  no echos :P
            return false;
        }
        $maxUsers = $cfg["app"]["max_users"];
        if ($maxUsers && $maxUsers > 0) {
            $query = $this->entityManager->createQuery('select count(u.id) FROM \repo\model\User u');
            // $repo = $this->entityManager->getRepository('\repo\model\User');
            // $repo->count();
            $userCount = $query->getSingleScalarResult();
            if ($userCount > $maxUsers) {
                die("User imit reached with $userCount");
            }
        }

        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.account = :account');
        $query->setParameter('account', $username);
        $query->execute();
        $count = sizeof($query->getResult());
        if ($count > 0) {
            return false;
        }
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $newAccount = new \repo\model\User($username, $password_hash);
        echo "Email verified: {$newAccount->isEmailVerified()}";
        $this->entityManager->persist($newAccount);
        $this->entityManager->flush();
        return true;
    }

    function logout(string $username): bool {
        return true;
    }
}
