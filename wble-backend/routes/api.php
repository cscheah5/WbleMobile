<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubjectController;

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
