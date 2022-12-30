<?php

namespace controller;

use controller\exception\HttpStatusException;
use repo\model\ClobStorageObject;

class ClobStorageController {

    /**
     * Main entry point for the controller.
     */
    public function processRequest(string $verb, array $pathSegments, string $requestBody = ''): array {
        $responseBody = array();
        global $authResult;
        $user = $authResult->getAccount();
        if (empty($user)) {
            throw new HttpStatusException("Authorization required", 401);
        }
        $clobUser = $pathSegments[0];
        $clobKey = $pathSegments[1];
        // TODO: replace this access check by some more sophisticated method
        if (strtolower($user) !== strtolower($clobUser)) {
            throw new HttpStatusException("Forbidden", 403);
        }
        switch ($verb) {
            case "GET":
                $responseBody[$clobKey] = $this->getClob($clobUser, $clobKey);
                break;
            case "PUT":
                $responseBody["status"] = $this->putClob($clobUser, $clobKey, $requestBody);
                break;
        }

        return $responseBody;
    }

    public function putClob(string $clobUser, string $clobKey, string $clobData): string {
        global $entityManager; // FIXME: replace all 'global X' with 'global applicationContext'
        // $entityManager->createQuery("SELECT \repo\model\ClobStorageObject ")
        $data = $this->loadClob($clobUser, $clobKey);
        if (empty($data)) {
            // FIXME: create and use UserDAO, UserDetailService or UserRepository here
            $userQuery = $entityManager->createQuery('SELECT u from \repo\model\User u WHERE u.account = :name');
            $userQuery->setParameter('name', $clobUser);
            $user = $userQuery->getOneOrNullResult();
            $data = new ClobStorageObject($user, $clobKey, $clobData);
        } else {
            $data->setContent($clobData);
        }
        $entityManager->persist($data);
        $entityManager->flush();

        return "OK";
    }

    private function loadClob($clobUser, $clobKey) {
        global $entityManager; // FIXME: replace all 'global X' with 'global applicationContext'
        $query = $entityManager->createQuery('SELECT s from \repo\model\ClobStorageObject s 
        JOIN s.user u  WHERE u.account = :name and s.key = :key ');
        $query->setParameter('name', $clobUser);
        $query->setParameter('key', $clobKey);
        return $query->getOneOrNullResult();
    }

    public function getClob(string $clobUser, string $clobKey) {
        $data = $this->loadClob($clobUser, $clobKey);
        if (empty($data)) {
            return "";
        }
        return $data;
    }
}
