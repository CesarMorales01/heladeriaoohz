<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\MetodosGenerales;

class ToppingsToCarController extends Controller
{
    use MetodosGenerales;
    public function index()
    {
        
    }

    public function create()
    {
    }

    public function getIdCart(){
        $idCart=0;
        $getIdCart=DB::table('cartotoppings')->orderBy('idCart', 'desc')->first();
        if($getIdCart!=null){
            $idCart=$getIdCart->idCart+1;
        }
        return $idCart;
    }

    public function save(Request $request){
        $datos = json_decode(file_get_contents('php://input'));
        $idCart=0;
        if($datos->top->idCart==''){
           $idCart=$this->getIdCart();
        }else{
            $idCart=$datos->top->idCart;
        }       
        DB::table('cartotoppings')->insert([
            'idCart'=>$idCart,
            'nombre' => $datos->top->nombre,
            'fk_producto' => $datos->prod->id,
            'cantidad' => $datos->top->cant,
            'valor' => $datos->top->valor,
            'fecha'=> $this->getFechaHoy()
        ]);
        $tops=DB::table('cartotoppings')->where('idCart', '=', $idCart)->get();
        return response()->json($tops, 200, []);
    }

    public function actualizar(Request $request){
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('cartotoppings')->where('id', '=', $datos->id)->update([
            'cantidad' => intval($datos->cantidad)+intval($datos->nuevaCantidad),
        ]);
        $tops=DB::table('cartotoppings')->where('idCart', '=', $datos->idCart)->get();
        foreach($tops as $t){
            if($t->cantidad==0){
                $this->borrarOne($t->id, $t->idCart);
            }
        }
        return response()->json($tops, 200, []);
    }

    public function actualizarSuperCant(Request $request){
        
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('cartotoppings')->where('id', '=', $datos->id)->update([
            'cantidad' => $datos->nuevaCantidad,
        ]);
        $tops=DB::table('cartotoppings')->where('idCart', '=', $datos->idCart)->get();
        foreach($tops as $t){
            if($t->cantidad==0){
                $this->borrarOne($t->id, $t->idCart);
            }
        }
        return response()->json($tops, 200, []);
    }

    public function store(Request $request)
    {
        
    }

    public function borrar(string $fk_producto, string $idCart)
    {
        DB::table('cartotoppings')->where('fk_producto', '=', $fk_producto)->where('idCart', '=', $idCart)->delete();
        $tops=DB::table('cartotoppings')->where('idCart', '=', $idCart)->get();
        DB::table('cartotoppings')->where('fecha', '!=', $this->getFechaHoy())->delete();
        return response()->json($tops, 200, []);
    }

    public function show(string $id)
    {
    }

    public function borrarOne(string $idTop, string $idCart)
    {
        DB::table('cartotoppings')->where('id', '=', $idTop)->delete();
        $tops=DB::table('cartotoppings')->where('idCart', '=', $idCart)->get();
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
