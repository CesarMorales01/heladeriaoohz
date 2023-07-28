<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Factura</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
        .styleTitulo {
            border: 1px solid;
            border-radius: 20px;
        }

        .bordeRedondo {
            border-collapse: separate;
            border: solid black 1px;
            border-radius: 6px;
        }
    </style>
</head>

<body class="font-sans antialiased">
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th class="align-middle">
                        <img src="{{ URL::asset('/Images/Config/logoFactura.jpeg') }}" alt="" width="120"
                            height="120">
                    </th>
                    <th style="color: white;">--------</th>
                    <th class="align-middle">
                        <h4>Heladeria Oohz</h4>
                        <p>Nit 1.098.704.203-8<br>
                            Calle 7 # 42 - 03 San bernardo 4 etapa<br>
                            Tel 3186900317<br>
                            Floridablanca Santander
                        </p>
                    </th>
                    <th class="align-middle">
                        <h4 style="font-size:16px;">Factura N°</h4>
                        <p id="tv_factura_n">{{ $data[0]->id }}</p>
                    </th>
                </tr>
            </thead>
        </table>
        <table class="table bordeRedondo">
            <thead>
                <th>Cliente</th>
                <td colspan="5"> {{ $data[0]->cliente->nombre }}</td>
            </thead>
            <tbody>
                <tr>
                    <th>Dirección</th>
                    <td colspan="3">{{ $data[0]->cliente->direccion }}</td>
                    <th>Ciudad</th>
                    <td>{{ $data[0]->cliente->nombreCiudad }}</td>
                </tr>
                <tr>
                    <th>NIT</th>
                    <td>{{ $data[0]->cliente->cedula }}</td>
                    <th>Télefono</th>
                    <td>{{ $data[0]->cliente->telefono }}</td>
                    <th>Fecha</th>
                    <td>{{ $data[0]->fecha }}</td>
                </tr>
            </tbody>
        </table>

        <table class="table bordeRedondo">
            <thead>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Valor unitario</th>
                <th>Subtotal</th>
            </thead>
            <tbody>
                @foreach ($data[0]->listaProductos as $item)
                    <tr>
                        <td>{{ $item->producto }}</td>
                        <td>{{ $item->cantidad }}</td>
                        <td>$ {{ number_format($item->precio, 0, ',', '.') }}</td>
                        <td>$ {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <table style="text-align:center;" class="table">
            <tr >
                <th style="color: white">------------</th>
                <th>Total a pagar</th>
                <td>$ {{ number_format($data[0]->totalFactura, 0, ',', '.') }}</td>
            </tr>
        </table>

        <br><br>
    </div>

    <!-- jquery-3.2.1.slim.min.js, bootstrap.min.js necesario para navbar. Debe ir primero jquery que bootstrap!!! -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous">
    </script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous">
    </script>
    <!-- Necesario para el carousel -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous">
    </script>
</body>

</html>
