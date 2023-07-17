<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait MetodosGenerales
{

    public function all_products()
    {
        return DB::table('products')->get();
    }

}