<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\MessageController;

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
    Route::get('/{userId}', [SubjectController::class, 'show']);
});

Route::group([
    'middleware' => 'api', // Base API middleware
    'prefix' => 'sections'
], function ($router) {
    Route::get('/{subjectId}', [SectionController::class, 'show']);
});

Route::group([
    'middleware' => 'api', // Base API middleware
    'prefix' => 'friends'
], function ($router) {
    Route::get('/', [FriendController::class, 'index']);
    Route::post('/search-user', [FriendController::class, 'searchUser']);
    Route::get('/send-friend-request/{friendId}', [FriendController::class, 'sendFriendRequest']);
    Route::get('/requests', [FriendController::class, 'getFriendRequests']);
    Route::get('/accept-friend-request/{friendId}', [FriendController::class, 'acceptFriendRequest']);
    Route::get('/reject-friend-request/{friendId}', [FriendController::class, 'rejectFriendRequest']);
    Route::get('/unfriend/{friendId}', [FriendController::class, 'unfriend']);
});

Route::group(['middleware' => 'api', 'prefix' => 'messages'], function ($router) {
    Route::get('/{friendId}', [MessageController::class, 'show']);
    Route::post('/create', [MessageController::class, 'createMessage']);
});
