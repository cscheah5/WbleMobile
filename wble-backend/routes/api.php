<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\AnnouncementController;

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
    Route::get('/{subjectId}', [SectionController::class, 'showCurrentWeek']);
    Route::get('/{subjectId}/all', [SectionController::class, 'showAll']);
    Route::get('/{subjectId}/materials', [SectionController::class, 'showMaterials']);
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

Route::middleware('auth:api')->group(function () {
    // Section routes
    Route::post('/sections', [SectionController::class, 'store']);
    Route::put('/sections/{id}', [SectionController::class, 'update']);
    Route::delete('/sections/{id}', [SectionController::class, 'destroy']);
    
    // Announcement routes
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);
    
    // Material routes
    Route::post('/materials/upload', [MaterialController::class, 'upload']);
    Route::put('/materials/{id}', [MaterialController::class, 'update']);
    Route::delete('/materials/{id}', [MaterialController::class, 'destroy']);
    Route::get('/materials/download/{id}', [MaterialController::class, 'download']);
    Route::get('/download/materials/{id}', [MaterialController::class, 'publicDownload']);
});

Route::get('/public/materials/download/{id}', [MaterialController::class, 'publicDownload']);
