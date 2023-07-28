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
        $compras = DB::table('lista_compras')->orderBy('id', 'desc')->paginate(100);
        foreach ($compras as $compra) {
            // Validar si la compra pertenece a un cliente registrado... si no mandar id
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
            'comentario_cliente' => $datos->comentario_cliente,
            'compra_n' => $compra_n,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'costo_medio_pago' => $datos->costo_medio_pago,
            'comentarios' => $datos->comentarios,
            'estado' => 'Recibida',
            'vendedor' => Auth()->user()->name
        ]);
        $id = DB::getPdo()->lastInsertId();
        $nums = count($datos->listaProductos);
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'fk_compra' => $id,
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
            'comentario_cliente' => $datos->comentario_cliente,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'costo_medio_pago' => $datos->costo_medio_pago,
            'comentarios' => $datos->comentarios,
            'estado' => 'Recibida'
        ]);
        $nums = count($datos->listaProductos);
        DB::table('lista_productos_comprados')->where('fk_compra', '=', $datos->id)->delete();
        // Al eliminar producto comprado se debe sumar al inventario...
        for ($z = 0; $z < count($datos->listaProductosAntiguos); $z++) {
            $this->sumarInventario($datos->listaProductosAntiguos[$z]);
        }
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'fk_compra' => $datos->id,
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
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
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
        $totalFactura=0;
        foreach($listaProductos as $item){
            $subtotal=$item->precio*$item->cantidad;
            $item->subtotal=$subtotal;
            $totalFactura=$totalFactura+$subtotal;
        }
        $datosCompra->totalFactura=$totalFactura;
        $datosCompra->listaProductos = $listaProductos;
        if ($datosCompra->cliente != '') {
            $cliente = DB::table('clientes')->where('cedula', '=', $datosCompra->cliente)->first();
            $ciudad=DB::table('municipios')->where('id', '=', $cliente->ciudad)->first();
            $cliente->nombreCiudad=$ciudad->nombre;
            $telefono=DB::table('telefonos_clientes')->where('cedula', '=', $cliente->cedula)->first();
            $cliente->telefono=$telefono->telefono;
            $datosCompra->cliente = $cliente;
            $data[] = $datosCompra;
            $pdf = App::make('dompdf.wrapper');
            $pdf = Pdf::loadView('Factura', compact('data'));
            return $pdf->stream();
        }
    }

    public function setSubtotal($item){
        return $item->cantidad+1;
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
        $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $id)->get();
        $datosCompra->listaProductos = $listaProductos;

        if ($datosCompra->cliente != '') {
            $cliente = DB::table('clientes')->where('cedula', '=', $datosCompra->cliente)->first();
            $datosCompra->cliente = $cliente;
        } else {
            $cliente1 = new stdClass();
            $cliente1->cedula = '';
            $cliente1->nombre = '';
            $datosCompra->cliente = $cliente1;
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
