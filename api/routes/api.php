<?php

use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MusicController;
use Illuminate\Support\Facades\Route;
use wapmorgan\Mp3Info\Mp3Info;

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

Route::prefix('users')->controller(UserController::class)->group(function() {
    Route::get('/', 'listAll');
    Route::get('/{name}/notifications', 'notifications');

    Route::post('/', 'save');

    Route::put('/notifications', 'readNotifications');
    
});

Route::prefix('auth')->controller(AuthController::class)->group(function() {
    Route::get('/', 'authenticate');
    Route::post('/', 'login');
    Route::delete('/', 'logout');
});

Route::prefix('musics')->controller(MusicController::class)->group(function() {
    Route::get('/', 'listAll');
    Route::get('/{username}', 'perUser');
    Route::get('/f', 'get');
    Route::post('/', 'save');
});