<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\ClientesImcompletosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\ShoppingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SessionController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('/product', ProductController::class);
    Route::get('/product/deleteimage/{id}', [ProductController::class, 'deleteImage'])->name('product.deleteImage');
    Route::post('/product/image/{id}', [ProductController::class, 'image'])->name('product.image');
    Route::get('/product/actualizar/{id}', [ProductController::class, 'actualizar'])->name('product.actualizar');
    Route::resource('/shopping', ShoppingController::class);
    Route::get('/shopping/shoppingChangeState/{state}/{value}', [ShoppingController::class, 'shoppingChangeState']);
    Route::get('/shopping/shoppingproducts/{id}/{n}', [ShoppingController::class, 'getProductosComprados']);
    Route::post('/shopping/save', [ShoppingController::class, 'save']);
    Route::post('/shopping/actualizar', [ShoppingController::class, 'actualizar']);
    Route::resource('/category', CategoryController::class);
    Route::post('/category/actualizar/{id}', [CategoryController::class, 'actualizar'])->name('category.actualizar');
    Route::resource('/registerincomplete', ClientesImcompletosController::class);
    Route::post('/customer/actualizar/{id}', [ClientesController::class, 'actualizar'])->name('customer.actualizar');
    Route::resource('/customer', ClientesController::class);
   
});

require __DIR__.'/auth.php';
