<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Marian',
            'email' => 'ejemplo@gmail.com',
            'password' => Hash::make('123456')
        ]);

        $cate=Category::create([
            'nombre'=> 'Helados',
             'imagen'=> 'helado.jpg'
        ]);

        $product=Product::create([
            'category_id'=> $cate->id,
            'nombre'=> 'Helado de fresa',
            'descripcion'=> 'Delicioso helado de fresa con crema de maní',
            'valor'=>'4000'
        ]);

        DB::table('imagenes_productos')->insert([
            'nombre_imagen'=>'heladofresa.jpg',
            'fk_producto'=>$product->id
        ]);



        
        

    }
}
