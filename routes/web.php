<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;

Route::get('/', [GameController::class, 'index']);
Route::post('/api/save', [GameController::class, 'save']);
Route::get('/api/load', [GameController::class, 'load']);
