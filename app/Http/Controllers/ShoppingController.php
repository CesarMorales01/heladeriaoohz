<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use stdClass;

class ShoppingController extends Controller
{
    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $compras = DB::table('lista_compras')->orderBy('id', 'desc')->paginate(100);
        foreach ($compras as $compra) {
            // Validar si la compra pertenece a un cliente registrado... si no mandar id
            $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
            if ($cliente == null) {
                $cliente1 = new stdClass();
                $cliente1->cedula = $compra->id;
                $cliente1->nombre = $compra->id;
                $compra->cliente = $cliente1;
            } else {
                $compra->cliente = $cliente;
            }
            $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $compra->cliente->cedula)->where('compra_n', '=', $compra->compra_n)->get();
            $compra->listaProductos = $listaProductos;
        }
        $token = csrf_token();
        return Inertia::render('Shopping/Shopping', compact('auth', 'compras', 'globalVars', 'token'));
    }

    public function create()
    {
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $clientes = $this->all_clientes();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $productos = $this->all_products();
        $token = csrf_token();
        $datosCompra = new stdClass();
        $datosCompra->id = '';
        // $datosPagina = DB::table('info_pagina')->first();
        //  $info = DB::table('info_pagina')->first();
        return Inertia::render('Shopping/NewShopping', compact('auth', 'clientes', 'globalVars', 'deptos', 'municipios', 'productos', 'token', 'datosCompra'));
    }

    public function save(Request $request)
    {
        $datos = json_decode(file_get_contents('php://input'));
        $compra_n = 1;
        if ($datos->cliente != '') {
            $compra_n = strval($this->get_compra_n($datos->cliente));
        }
        DB::table('lista_compras')->insert([
            'cliente' => $datos->cliente,
            'compra_n' => $compra_n,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'comentarios' => $datos->comentarios,
            'estado' => 'Recibida',
            'vendedor' => Auth()->user()->name
        ]);
        // Asignar id de compra en lista productos comprados si no hay cliente para poder eliminarlos despues...
        if ($datos->cliente == '') {
            $id = DB::getPdo()->lastInsertId();
            DB::table('lista_compras')->where('id', '=', $id)->update([
                'cliente' => $id
            ]);
            $datos->cliente = $id;
        }
        $nums = count($datos->listaProductos);
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'cliente' => $datos->cliente,
                'compra_n' => $compra_n,
                'codigo' => $datos->listaProductos[$i]->codigo,
                'producto' => $datos->listaProductos[$i]->nombre,
                'cantidad' => $datos->listaProductos[$i]->cantidad,
                'precio' => $datos->listaProductos[$i]->precio
            ]);
            $this->restarInventario($datos->listaProductos[$i]);
        }
        return response()->json('ok', 200, []);
    }

    public function actualizar(Request $request)
    {
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('lista_compras')->where('id', '=', $datos->id)->update([
            'cliente' => $datos->cliente,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'comentarios' => $datos->comentarios,
            'estado' => 'Recibida'
        ]);
        $nums = count($datos->listaProductos);
        DB::table('lista_productos_comprados')->where('cliente', '=', $datos->cliente)->where('compra_n', '=', $datos->compra_n)->delete();
        // Al eliminar producto comprado se debe sumar al inventario...
        for ($z = 0; $z < count($datos->listaProductosAntiguos); $z++) {
            $this->sumarInventario($datos->listaProductosAntiguos[$z]);
        }
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'cliente' => $datos->cliente,
                'compra_n' => $datos->compra_n,
                'codigo' => $datos->listaProductos[$i]->codigo,
                'producto' => $datos->listaProductos[$i]->nombre,
                'cantidad' => $datos->listaProductos[$i]->cantidad,
                'precio' => $datos->listaProductos[$i]->precio
            ]);
            $this->restarInventario($datos->listaProductos[$i]);
        }
        return response()->json('updated', 200, []);
    }

    public function sumarInventario($item)
    {
        $actualCant = DB::table('productos')->where('id', '=', $item->codigo)->first();
        if($actualCant){
            if ($actualCant->cantidad != null) {
                $newCant = intval($actualCant->cantidad) + intval($item->cantidad);
                DB::table('productos')->where('id', '=', $item->codigo)->update([
                    'cantidad' => $newCant
                ]);
            }
        }
    }

    public function restarInventario($item)
    {
        $actualCant = DB::table('productos')->where('id', '=', $item->codigo)->first();
        if($actualCant){
            if ($actualCant->cantidad != null && $actualCant->cantidad != 0) {
                $newCant = $actualCant->cantidad - $item->cantidad;
                DB::table('productos')->where('id', '=', $item->codigo)->update([
                    'cantidad' => $newCant
                ]);
            }
        } 
    }

    public function store(Request $request)
    {
        // Eliminar aqui porque no se usa para guardar y admite post...
        $validarInventario1=DB::table('lista_productos_comprados')->where('cliente', '=', $request->cliente)->where('compra_n', '=', $request->compran)->first();
        $validarInventario2=DB::table('productos')->where('id', '=', $validarInventario1->codigo)->first();
        // Al eliminar producto comprado se debe sumar al inventario...
        if($validarInventario2){
            $this->sumarInventario($validarInventario1);
            
        }
        DB::table('lista_productos_comprados')->where('cliente', '=', $request->cliente)->where('compra_n', '=', $request->compran)->delete();
        DB::table('lista_compras')->where('id', '=', $request->idCompra)->delete();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $compras = DB::table('lista_compras')->orderBy('id', 'desc')->paginate(100);
        foreach ($compras as $compra) {
            // Validar si la compra pertenece a un cliente registrado... si no mandar id
            $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
            if ($cliente == null) {
                $cliente1 = new stdClass();
                $cliente1->cedula = $compra->id;
                $cliente1->nombre = $compra->id;
                $compra->cliente = $cliente1;
            } else {
                $compra->cliente = $cliente;
            }
            $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $compra->cliente->cedula)->where('compra_n', '=', $compra->compra_n)->get();
            $compra->listaProductos = $listaProductos;
        }
        $token = csrf_token();
        $estado = "¡Compra eliminada!";
        return Inertia::render('Shopping/Shopping', compact('auth', 'compras', 'globalVars', 'token', 'estado'));
    }

    public function show(string $id)
    {
    }

    public function edit(string $id)
    {
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $clientes = $this->all_clientes();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $productos = $this->all_products();
        $token = csrf_token();
        $datosCompra = DB::table('lista_compras')->where('id', '=', $id)->first();
        $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $id)->get();
        $datosCompra->listaProductos = $listaProductos;
        $cliente = DB::table('clientes')->where('cedula', '=', $id)->first();
        if ($cliente == null) {
            $cliente1 = new stdClass();
            $cliente1->cedula = $id;
            $cliente1->nombre = $id;
            $datosCompra->cliente = $cliente1;
        } else {
            $datosCompra->cliente = $cliente;
        }
        return Inertia::render('Shopping/NewShopping', compact('auth', 'clientes', 'globalVars', 'deptos', 'municipios', 'productos', 'token', 'datosCompra'));
    }

    public function update(Request $request, string $id)
    {
    }

    public function destroy(string $id)
    {
    }

    public function allshopping()
    {
        $compras = DB::table('lista_compras')->get();
        foreach ($compras as $compra) {
            $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
            if ($cliente == null) {
                $cliente1 = new stdClass();
                $cliente1->cedula = $compra->id;
                $cliente1->nombre = $compra->id;
                $compra->cliente = $cliente1;
            } else {
                $compra->cliente = $cliente;
            }
            $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $compra->cliente->cedula)->where('compra_n', '=', $compra->compra_n)->get();
            $compra->listaProductos = $listaProductos;
        }
        return response()->json($compras, 200, []);
    }

    public function getProductosComprados(string $id, string $compran)
    {
        $compras = DB::table('lista_productos_comprados')->where('cliente', '=', $id)->where('compra_n', '=', $compran)->get();
        return response()->json($compras, 200, []);
    }

    public function shoppingChangeState(string $id, string $state)
    {
        DB::table('lista_compras')->where('id', '=', $id)->update([
            'estado' => $state
        ]);
        $estado = DB::table('lista_compras')->where('id', '=', $id)->pluck('estado');
        return response()->json($estado, 200, []);
    }
}
