<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\FriendController;

Route::group([
    'middleware' => 'api', // Base API middleware
    'prefix' => 'auth'
], function ($router) {
    // Public routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Protected routes (will use auth:api from controller's constructor)
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/user', [AuthController::class, 'getUser']);
    });
});

Route::group([
    'middleware' => 'api', // Base API middleware
    'prefix' => 'subjects'
], function ($router) {
    Route::get('/{id}', [SubjectController::class, 'show']);
});

Route::group([
    'middleware' => 'api', // Base API middleware
    'prefix' => 'sections'
], function ($router) {
    Route::get('/{id}', [SectionController::class, 'show']);
});

Route::group([
    'middleware' => 'api', // Base API middleware
    'prefix' => 'friends'
], function ($router) {
    Route::get('/', [FriendController::class, 'index']);
    Route::post('/search-user', [FriendController::class, 'searchUser']);
    Route::get('/send-friend-request/{id}', [FriendController::class, 'sendFriendRequest']);
    Route::get('/requests', [FriendController::class, 'getFriendRequests']);
    Route::get('/accept-friend-request/{id}', [FriendController::class, 'acceptFriendRequest']);
    Route::get('/reject-friend-request/{id}', [FriendController::class, 'rejectFriendRequest']);
    Route::get('/unfriend/{id}', [FriendController::class, 'unfriend']);
});
