<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use stdClass;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\App;

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
        $globalVars->info = DB::table('info_pagina')->first();
        $compras = DB::table('lista_compras')->whereBetween('fecha', [$this->getFechaHoy(), $this->getFechaHoy()])->paginate(100);
        foreach ($compras as $compra) {
            $compra->cliente=$this->getClienteCompra($compra->cliente);
            $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $compra->id)->get();
            $compra->listaProductos = $listaProductos;
        }
        $token = csrf_token();
        return Inertia::render('Shopping/Shopping', compact('auth', 'compras', 'globalVars', 'token'));
    }

    function getClienteCompra($cliente)
    {
        // Validar si la compra pertenece a un cliente registrado... si no mandar id
        $getCliente='';
        if ($cliente != '') {
            $getCliente = DB::table('clientes')->where('cedula', '=', $cliente)->first();
        } else {
            $cliente1 = new stdClass();
            $cliente1->cedula = '';
            $cliente1->nombre = '';
            $getCliente = $cliente1;
        }
        return $getCliente;
    }

    public function listByDate($finicial, $ffinal)
    {
        $lista = DB::table('lista_compras')->whereBetween('fecha', [$finicial, $ffinal])->orderBy('fecha', 'desc')->get();
        foreach ($lista as $compra) {
            $compra->cliente=$this->getClienteCompra($compra->cliente);
            $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $compra->id)->get();
            $compra->listaProductos = $listaProductos;
        }
        return response()->json($lista, 200, []);
    }

    public function create()
    {
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $clientes = $this->all_clientes();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $productos = $this->all_products();
        foreach ($productos as $p) {
            $img = DB::table('imagenes_productos')->where('fk_producto', '=', $p->id)->first();
            if ($img != null) {
                $p->imagen = $img->nombre_imagen;
            } else {
                $p->imagen = '';
            }
        }
        $token = csrf_token();
        $datosCompra = new stdClass();
        $datosCompra->id = '';
        $categorias = DB::table('categorias')->get();
        $adiciones = DB::table('toppings')->get();
        $categoriasAdiciones = DB::table('categorias_toppings')->get();
        return Inertia::render('Shopping/NewShopping', compact('auth', 'clientes', 'globalVars', 'deptos', 'municipios', 'productos', 'token', 'datosCompra', 'categorias', 'adiciones', 'categoriasAdiciones'));
    }

    public function printList($id)
    {
        //Imprimir pedido para cocina..
        $datosCompra = DB::table('lista_compras')->where('id', '=', $id)->first();
        $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $id)->get();
        foreach ($listaProductos as $list) {
            $tops = DB::table('lista_toppings_comprados')->where('fk_compra', '=', $id)->where('fk_producto', '=', $list->codigoProductoCarrito)->get();
            if ($tops) {
                $list->tops = $tops;
            }
        }
        $datosCompra->listaProductos = $listaProductos;
        if ($datosCompra->cliente != '') {
            $cliente = DB::table('clientes')->where('cedula', '=', $datosCompra->cliente)->first();
            $datosCompra->cliente = $cliente;
        }
        $globalVars = $this->global->getGlobalVars();
        return Inertia::render('Shopping/PrintListProducts', compact('globalVars', 'datosCompra'));
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
            'comentario_cliente' => $datos->comentario_cliente,
            'compra_n' => $compra_n,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'costo_medio_pago' => $datos->costo_medio_pago,
            'comentarios' => $datos->comentarios,
            'dinerorecibido' => $datos->dinerorecibido,
            'cambio' => $datos->cambio,
            'estado' => 'Recibida',
            'vendedor' => Auth()->user()->name
        ]);
        $id = DB::getPdo()->lastInsertId();
        $nums = count($datos->listaProductos);
        $idCartToppings='';
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'fk_compra' => $id,
                'compra_n' => $compra_n,
                'codigo' => $datos->listaProductos[$i]->codigo,
                'codigoProductoCarrito' => $datos->listaProductos[$i]->id,
                'producto' => $datos->listaProductos[$i]->nombre,
                'descripcion' => $datos->listaProductos[$i]->descripcion,
                'cantidad' => $datos->listaProductos[$i]->cantidad,
                'precio' => $datos->listaProductos[$i]->precio
            ]);
            $this->restarInventario($datos->listaProductos[$i]);
            if ($datos->listaProductos[$i]->topping) {
                foreach ($datos->listaProductos[$i]->topping as $top) {
                    $idCartToppings=$top->idCart;
                    DB::table('lista_toppings_comprados')->insert([
                        'fk_compra' => $id,
                        'fk_producto' => $datos->listaProductos[$i]->id,
                        'nombre' => $top->nombre,
                        'valor' => $top->valor,
                        'cantidad' => $top->cantidad
                    ]);
                }
            }
        }
        DB::table('cartotoppings')->where('idCart', '=', $idCartToppings)->delete();
        return response()->json('ok', 200, []);
    }

    public function actualizar(Request $request)
    {
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('lista_compras')->where('id', '=', $datos->id)->update([
            'cliente' => $datos->cliente,
            'comentario_cliente' => $datos->comentario_cliente,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'costo_medio_pago' => $datos->costo_medio_pago,
            'comentarios' => $datos->comentarios,
            'dinerorecibido' => $datos->dinerorecibido,
            'cambio' => $datos->cambio,
            'estado' => $datos->estado
        ]);
        $nums = count($datos->listaProductos);
        DB::table('lista_productos_comprados')->where('fk_compra', '=', $datos->id)->delete();
        // Al eliminar producto comprado se debe sumar al inventario...
        for ($z = 0; $z < count($datos->listaProductosAntiguos); $z++) {
            $this->sumarInventario($datos->listaProductosAntiguos[$z]);
        }
        // Eliminar toppings anteriores
        DB::table('lista_toppings_comprados')->where('fk_compra', '=', $datos->id)->delete();
        $idCartToppings='';
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'fk_compra' => $datos->id,
                'compra_n' => $datos->compra_n,
                'codigo' => $datos->listaProductos[$i]->codigo,
                'codigoProductoCarrito'=> $datos->listaProductos[$i]->id,
                'producto' => $datos->listaProductos[$i]->nombre,
                'descripcion' => $datos->listaProductos[$i]->descripcion,
                'cantidad' => $datos->listaProductos[$i]->cantidad,
                'precio' => $datos->listaProductos[$i]->precio
            ]);
            $this->restarInventario($datos->listaProductos[$i]);
            //Ingresar toppings de nuevo
            if ($datos->listaProductos[$i]->topping) {
                foreach ($datos->listaProductos[$i]->topping as $top) {
                    $idCartToppings=$top->idCart;
                    DB::table('lista_toppings_comprados')->insert([
                        'fk_compra' => $datos->id,
                        'fk_producto' => $datos->listaProductos[$i]->id,
                        'nombre' => $top->nombre,
                        'valor' => $top->valor,
                        'cantidad' => $top->cantidad
                    ]); 
                } 
            }  
        }
        if($idCartToppings!=''){
            DB::table('cartotoppings')->where('idCart', '=', $idCartToppings)->delete();
        }
        return response()->json('updated', 200, []);
    }

    public function sumarInventario($item)
    {
        $actualCant = DB::table('productos')->where('id', '=', $item->codigo)->first();
        if ($actualCant) {
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
        if ($actualCant) {
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
        $validarInventario1 = DB::table('lista_productos_comprados')->where('fk_compra', '=', $request->idCompra)->get();
        // Al eliminar producto comprado se debe sumar al inventario...
        foreach ($validarInventario1 as $item) {
            $validarInventario2 = DB::table('productos')->where('id', '=', $item->codigo)->first();
            if ($validarInventario2) {
                $this->sumarInventario($item);
            }
        }
        DB::table('lista_productos_comprados')->where('fk_compra', '=', $request->idCompra)->delete();
        DB::table('lista_compras')->where('id', '=', $request->idCompra)->delete();
        DB::table('lista_toppings_comprados')->where('fk_compra', '=', $request->idCompra)->delete();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $compras = DB::table('lista_compras')->orderBy('id', 'desc')->paginate(100);
        foreach ($compras as $compra) {
            if ($compra->cliente != '') {
                $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
                $compra->cliente = $cliente;
            } else {
                $cliente1 = new stdClass();
                $cliente1->cedula = '';
                $cliente1->nombre = '';
                $compra->cliente = $cliente1;
            }
            $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $compra->id)->get();
            $compra->listaProductos = $listaProductos;
        }
        $token = csrf_token();
        $estado = "¡Compra eliminada!";
        return Inertia::render('Shopping/Shopping', compact('auth', 'compras', 'globalVars', 'token', 'estado'));
    }

    public function show(string $id)
    {
        //Ver venta en pdf con opcion para imprimir...
        $datosCompra = DB::table('lista_compras')->where('id', '=', $id)->first();
        $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $id)->get();
        $totalFactura = 0;
        $listaProds = [];
        foreach ($listaProductos as $item) {
            $subtotal = $item->precio * $item->cantidad;
            $item->subtotal = $subtotal;
            $tops = DB::table('lista_toppings_comprados')->where('fk_compra', '=', $id)->where('fk_producto', '=', $item->codigoProductoCarrito)->get();
            $totalTops = 0;
            if ($tops) {
                foreach ($tops as $top) {
                    $subTop = $top->valor * $top->cantidad;
                    $top->subtotal = $subTop;
                    $totalTops = ($totalTops + $subTop);
                }
                $item->tops = $tops;
            }
            $totalFactura = ($totalFactura + $subtotal) + (intval($totalTops) * $item->cantidad);
        }
        $datosCompra->totalFactura = $totalFactura;
        $datosCompra->listaProductos = $listaProductos;
        if ($datosCompra->cliente != '') {
            $cliente = DB::table('clientes')->where('cedula', '=', $datosCompra->cliente)->first();
            $ciudad = DB::table('municipios')->where('id', '=', $cliente->ciudad)->first();
            if ($ciudad == null) {
                $ciudad = '';
                $cliente->nombreCiudad = $ciudad;
            } else {
                $cliente->nombreCiudad = $ciudad->nombre;
            }
            $telefono = DB::table('telefonos_clientes')->where('cedula', '=', $cliente->cedula)->first();
            if ($telefono == null) {
                $telefono = '';
                $cliente->telefono = $telefono;
            } else {
                $cliente->telefono = $telefono->telefono;
            }
            $datosCompra->cliente = $cliente;
        }
        $data[] = $datosCompra;
        $pdf = App::make('dompdf.wrapper');
        $pdf = Pdf::loadView('Factura', compact('data'));
        return $pdf->stream('Factura-' . $datosCompra->id);
    }

    public function setSubtotal($item)
    {
        return $item->cantidad + 1;
    }

    public function edit(string $id)
    {
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $clientes = $this->all_clientes();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $productos = $this->all_products();
        foreach ($productos as $p) {
            $img = DB::table('imagenes_productos')->where('fk_producto', '=', $p->id)->first();
            if ($img != null) {
                $p->imagen = $img->nombre_imagen;
            } else {
                $p->imagen = '';
            }
        }
        $token = csrf_token();

        $datosCompra = DB::table('lista_compras')->where('id', '=', $id)->first();
        $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $id)->get();
        $datosCompra->listaProductos = $listaProductos;
        $toppings=DB::table('lista_toppings_comprados')->where('fk_compra', '=', $id)->get();
        $idCart=app(ToppingsToCarController::class)->getIdCart();
        if($toppings!=null){
            foreach($toppings as $top){
                DB::table('cartotoppings')->insert([
                    'idCart'=>$idCart,
                    'nombre' => $top->nombre,
                    'fk_producto' => $top->fk_producto,
                    'cantidad' => $top->cantidad,
                    'valor' => $top->valor,
                    'fecha' => $this->getFechaHoy()
                ]);
            }
        }else{
           $toppings=[]; 
        }
        $tops=DB::table('cartotoppings')->where('idCart', '=', $idCart)->get();

        $datosCompra->toppings=$tops;
        if ($datosCompra->cliente != '') {
            $cliente = DB::table('clientes')->where('cedula', '=', $datosCompra->cliente)->first();
            $datosCompra->cliente = $cliente;
        } else {
            $cliente1 = new stdClass();
            $cliente1->cedula = '';
            $cliente1->nombre = '';
            $datosCompra->cliente = $cliente1;
        }
        $categorias = DB::table('categorias')->get();
        $adiciones = DB::table('toppings')->get();
        $categoriasAdiciones = DB::table('categorias_toppings')->get();
        return Inertia::render('Shopping/NewShopping', compact('auth', 'clientes', 'globalVars', 'deptos', 'municipios', 'productos', 'token', 'datosCompra', 'categorias', 'adiciones', 'categoriasAdiciones'));
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
            if ($compra->cliente != '') {
                $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
                $compra->cliente = $cliente;
            } else {
                $cliente1 = new stdClass();
                $cliente1->cedula = '';
                $cliente1->nombre = '';
                $compra->cliente = $cliente1;
            }
            $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $compra->id)->get();
            $compra->listaProductos = $listaProductos;
        }
        return response()->json($compras, 200, []);
    }

    public function getProductosComprados(string $id)
    {
        $compras = DB::table('lista_productos_comprados')->where('fk_compra', '=', $id)->get();
        foreach ($compras as $compra) {
            $tops = DB::table('lista_toppings_comprados')->where('fk_compra', '=', $id)->where('fk_producto', '=', $compra->codigoProductoCarrito)->get();
            if ($tops) {
                $compra->tops = $tops;
            }
        }
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
