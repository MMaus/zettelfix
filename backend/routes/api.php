<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JsonBagController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// public
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// protected
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/bags', [JsonBagController::class, 'index']);
    Route::get('/bags/{name}', [JsonBagController::class, 'byName']);
    Route::put('/bags/{name}', [JsonBagController::class, 'put']);
    Route::post('/auth/logout', [UserController::class, 'logout']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
