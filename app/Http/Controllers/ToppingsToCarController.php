<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ToppingsToCarController extends Controller
{

    public function index()
    {
        
    }

    public function create()
    {
        //
    }

    public function save(Request $request){
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('cartotoppings')->insert([
            'nombre' => $datos->top->nombre,
            'fk_producto' => $datos->prod->id,
            'cantidad' => $datos->top->cant,
            'valor' => $datos->top->valor
        ]);
        $tops=DB::table('cartotoppings')->get();
        return response()->json($tops, 200, []);
    }

    public function actualizar(Request $request){
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('cartotoppings')->where('id', '=', $datos->id)->update([
            'cantidad' => intval($datos->cantidad)+intval($datos->nuevaCantidad),
        ]);
        $tops=DB::table('cartotoppings')->get();
        foreach($tops as $t){
            if($t->cantidad==0){
                $this->borrarOne($t->id);
            }
        }
        return response()->json($tops, 200, []);
    }

    public function store(Request $request)
    {
        
    }

    public function borrar(string $id)
    {
        DB::table('cartotoppings')->where('fk_producto', '=', $id)->delete();
        $tops=DB::table('cartotoppings')->get();
        return response()->json($tops, 200, []);
    }

    public function show(string $id)
    {
    }

    public function borrarOne(string $id)
    {
        DB::table('cartotoppings')->where('id', '=', $id)->delete();
        $tops=DB::table('cartotoppings')->get();
        return response()->json($tops, 200, []);
    }


    public function edit(string $id)
    {
    }

    public function update(Request $request, string $id)
    {
        
    }

    public function destroy(string $id)
    {
        //
    }
}
