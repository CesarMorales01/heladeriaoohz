<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/product/allproducts', [ProductController::class, 'allproducts']);
Route::get('/product/getimages/{id}', [ProductController::class, 'getimages'])->name('product.getimages');
