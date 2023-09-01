<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ToppingsController extends Controller
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
        $toppings=DB::table('toppings')->get();
        $token = csrf_token();
        $estado='';
        if($state!='nothing'){
            $estado=$state;
        }
        return Inertia::render('Topping/Toppings', compact('auth', 'toppings', 'globalVars', 'estado', 'token'));
    }
    
    public function index()
    {
        
    }

    
    public function create()
    {
        
    }

    public function store(Request $request)
    {
        $fileName='';
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenesCategorias, $fileName); 
        }
        DB::table('toppings')->insert([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'valor' => $request->valor,
            'imagen' => $fileName
        ]);
        return redirect()->route('topping.list', '¡Nuevo topping registrado!');
    }
    
    public function show(string $id)
    {
        $img=DB::table('toppings')->where('id', $id)->first();
        if($img->imagen!=''){
            unlink($this->global->getGlobalVars()->dirImagenesCategorias . $img->imagen);
        }
        DB::table('toppings')->where('id', $id)->delete();
        return redirect()->route('topping.list', '¡Topping eliminado!');
    }

    public function actualizar(Request $request, string $id)
    {
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenesCategorias, $fileName);
            if($request->nombreImagenAnterior!=''){
                unlink($this->global->getGlobalVars()->dirImagenesCategorias . $request->nombreImagenAnterior);
            }
            DB::table('toppings')->where('id', '=', $id)->update([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'valor' => $request->valor,
                'imagen' => $fileName
            ]);
        }else{
            DB::table('toppings')->where('id', '=', $id)->update([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'valor' => $request->valor
            ]);
        }
       
        return redirect()->route('topping.list', '¡Topping actualizado!');
    }


    public function edit(string $id)
    {
        //
    }

 
    public function update(Request $request, string $id)
    {
        //
    }


    public function destroy(string $id)
    {
        //
    }
}
