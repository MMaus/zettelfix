<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller {

    /**
     * Register user
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request) {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed'
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);
        return response($user, 201);
    }

    /**
     * Log in
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request) {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response(['message' => 'Provided credentials are invalid'], 401);
        }
        return response($user->createToken('someSpecificValue')->plainTextToken);
    }

    /**
     * Log out
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response(['message' => 'successfully logged out']);
    }
}
