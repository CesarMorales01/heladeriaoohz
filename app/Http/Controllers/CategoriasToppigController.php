<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CategoriasToppigController extends Controller
{

    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function listar($state)
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $catetoppings=DB::table('categorias_toppings')->get();
        $token = csrf_token();
        $estado='';
        if($state!='nothing'){
            $estado=$state;
        }
        return Inertia::render('Topping/CateToppings', compact('auth', 'catetoppings', 'globalVars', 'estado', 'token'));
    }

    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
       DB::table('categorias_toppings')->insert([
        'nombre'=>$request->nombre
       ]);
       return Redirect::route('catetopping.list', 'Nueva categoria topping registrada!');
    }


    public function show(string $id)
    {
        $ifExist=DB::table('toppings')->where('categoria', '=', $id)->first();
        if($ifExist){
            return Redirect::route('catetopping.list', 'No puedes eliminar esta categoria porque esta siendo utilizada por algunos toppings!!');
        }else{
            DB::table('categorias_toppings')->where('id', '=', $id)->delete();
            return Redirect::route('catetopping.list', 'Categoria topping eliminada!');
        }
    }

    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
