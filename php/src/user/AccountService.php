<?php

namespace user;

use \Doctrine\ORM\EntityManager;
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
        $query->setParameter('account', strtolower($account));
        $user = $query->getOneOrNullResult();
        return $user;
    }

    function loginValid(string $account, string $password): bool {
        // get_user
        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.account = :account');
        $query->setParameter('account', strtolower($account));
        $user = $query->getOneOrNullResult();
        if ($user == null) {
            return false;
        }
        if (!password_verify($password, $user->getPasswordHash())) {
            return false;
        }
        return true;
    }

    function sendPasswordResetEmail(string $account): bool {
        if (!$this->accountExists($account) || !$this->isValidEmail($account)) {
            return false;
        }
        $token = $this->generatePasswordResetTokenFor($account);
        $urlToken = urlencode($token);
        global $cfg;
        $domain = $cfg['host']['domain'];
        $api = $cfg['api']['api_base_url'];
        $serviceEmail = $cfg['host']['serviceEmail'];
        $message = "There is a password reset available for your account.\r\n" .
            "If you did not requested a password reset, or if you do not wish to reset your password,\r\n" .
            "then you do not have to do anything.\r\n\r\n" .
            "To reset your password, open the link below in your browser.\r\n\r\n" .
            "{$domain}/#/resetPassword/$urlToken\r\n\r\n" .
            "Cheers!";
        echo "Sending message: $message";
        mail($account, "Password Reset", $message, ["From" => $serviceEmail]);
        return true;
        strtolower($account);
        return true;
    }

    function resetPassword(string $token, string $password) {
        $query = $this->entityManager->createQuery(
            'SELECT u FROM \repo\model\User u WHERE u.passwordResetToken = :token ' .
                ' AND u.passwordResetToken IS NOT NULL ' .
                ' AND u.passwordResetTime > :maxTime '
        );
        $query->setParameter('token', $token);
        $query->setParameter('maxTime', new \DateTime("now -2 hour"));
        $users = $query->getResult();
        if (sizeof($users) == 0) {
            return false;
        }
        $user = $users[0];
        $user->setPasswordHash(password_hash($password, PASSWORD_BCRYPT));
        $user->setPasswordResetToken(null);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return true;
    }


    private function isValidEmail(string $email) {
        return preg_match("/^\S+@\S+\.\S+$/", $email);
    }

    private function accountExists(string $account): bool {
        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.account = :account');
        $query->setParameter('account', strtolower($account));
        $query->execute();
        $count = sizeof($query->getResult());
        return $count > 0;
    }

    function registerAccount(string $rawUsername, string $password): bool {
        global $cfg;
        $username = trim($rawUsername);
        if (!$this->isValidEmail($username)) {
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

        if ($this->accountExists($username)) {
            return false;
        }
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $newAccount = new \repo\model\User(strtolower($username), $password_hash);
        echo "Email verified: {$newAccount->isEmailVerified()}";
        $this->entityManager->persist($newAccount);
        $this->entityManager->flush();
        return true;
    }

    function verifyEmail(string $token): bool {
        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.emailVerificationToken = :token AND u.emailVerificationToken IS NOT NULL');
        $query->setParameter('token', $token);
        $users = $query->getResult();
        if (sizeof($users) > 0) {
            $user = $users[0];
            $user->setEmailVerified(true);
            $user->setEmailVerificationToken(null);
            $this->entityManager->persist($user);
            $this->entityManager->flush();
            return true;
        }
        return false;
    }

    function sendVerificationEmail(string $email): bool {
        $token = $this->generateEmailVerificationTokenFor($email);
        $token = urlencode($token);
        global $cfg;
        $domain = $cfg['host']['domain'];
        $api = $cfg['api']['api_base_url'];
        $serviceEmail = $cfg['host']['serviceEmail'];
        $message = "Please verify your email address by clicking on the link below:\r\n"
            . "\r\n"
            . "{$domain}{$api}/login/verifyEmail?emailVerificationToken=$token\r\n";
        echo "Sending message: $message";
        mail($email, "Verify it's  you!", $message, ["From" => $serviceEmail]);
        return true;
    }

    private function generateEmailVerificationTokenFor(string $account): string {
        $token = base64_encode(random_bytes(42));
        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.account = :account');
        $query->setParameter('account', strtolower($account));
        $user = $query->getSingleResult();
        $user->setEmailVerificationToken($token);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return $token;
    }

    private function generatePasswordResetTokenFor(string $account): string {
        $token = base64_encode(random_bytes(42));
        $query = $this->entityManager->createQuery('SELECT u FROM \repo\model\User u WHERE u.account = :account');
        $query->setParameter('account', strtolower($account));
        $user = $query->getSingleResult();
        $user->setPasswordResetToken($token);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return $token;
    }

    function logout(string $username): bool {
        return true;
    }
}
