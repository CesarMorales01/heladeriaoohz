import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import SelectClientes from './SelectClientes';
import ShoppingCart from './ShoppingCart';
import PrimaryButton from '@/Components/PrimaryButton'
import '../../../css/general.css'
import DialogoShoppingCart from './DialogoShoppingCart';
import ShowProducts from './ShowProducts';
import AddToppings from './AddToppings';
import DialogoLoading from '../UIGeneral/DialogoLoading';

const NuevaCompra = (params) => {
    const glob = new GlobalFunctions()
    const [datosCompra, setDatosCompra] = useState({
        cliente: '',
        nombreCliente: '',
        comentario_cliente: '',
        fecha: '',
        total_compra: 0,
        domicilio: 0,
        medio_de_pago: 'Efectivo',
        costo_medio_pago: 0,
        comentarios: '',
        dinerorecibido: '',
        cambio: '',
        estado: 'Recibida',
        vendedor: '',
        listaProductos: [],
        listaProductosAntiguos: [],
        id: '',
        compra_n: ''
    })
    const [opcionesPago] = useState([
        'Efectivo', 'Pago electronico'
    ])
    const [windowDisplay, setWindowDisplay] = useState(1)
    const [toppingSelected, setTopppingSelected] = useState([])
    const [productToTopping, setProductToTopping] = useState({})
    const [idAutoIncrement, setIdAutoIncrement] = useState(100)
    const [loadingTops, setLoadingTops] = useState('none')

    useEffect(() => {
        if (params.datosCompra.id == '') {
            setFecha()
        } else {
            cargarParametros()
            if (datosCompra.cliente == '') {

            }
        }
        glob.setCookie('tops', JSON.stringify(params.adiciones), 3600 * 60)
    }, [])

    useEffect(() => {
        if (datosCompra.listaProductos.length > 0) {
            // calcularTotales(datosCompra.listaProductos, toppingSelected)
        }
    }, [datosCompra.medio_de_pago])

    function cargarParametros() {
        let array = []
        setTopppingSelected(params.datosCompra.toppings)
        for (let i = 0; i < params.datosCompra.listaProductos.length; i++) {
            let arraytops = []
            for (let z = 0; z < params.datosCompra.toppings.length; z++) {
                if (params.datosCompra.toppings[z].fk_producto == params.datosCompra.listaProductos[i].codigoProductoCarrito) {
                    arraytops.push(params.datosCompra.toppings[z])
                }
            }
            let objeto = {
                id: params.datosCompra.listaProductos[i].codigoProductoCarrito,
                codigo: params.datosCompra.listaProductos[i].codigo,
                nombre: params.datosCompra.listaProductos[i].producto,
                descripcion: params.datosCompra.listaProductos[i].descripcion,
                cantidad: params.datosCompra.listaProductos[i].cantidad,
                precio: params.datosCompra.listaProductos[i].precio,
                fk_compra: params.datosCompra.listaProductos[i].fk_compra,
                topping: arraytops
            }
            array.push(objeto)
            //Set autoincrement valor mas alto
            if (idAutoIncrement <= params.datosCompra.listaProductos[i].codigoProductoCarrito) {
                setIdAutoIncrement(parseInt(params.datosCompra.listaProductos[i].codigoProductoCarrito) + 1)
            }
        }
        document.getElementById('inputDate').value = params.datosCompra.fecha
        setDatosCompra((valores) => ({
            ...valores,
            fecha: params.datosCompra.fecha,
            cliente: params.datosCompra.cliente.cedula,
            nombreCliente: params.datosCompra.cliente.nombre,
            comentario_cliente: params.datosCompra.comentario_cliente,
            total_compra: params.datosCompra.total_compra,
            domicilio: params.datosCompra.domicilio,
            medio_de_pago: params.datosCompra.medio_de_pago,
            comentarios: params.datosCompra.comentarios,
            cambio: params.datosCompra.cambio,
            dinerorecibido: params.datosCompra.dinerorecibido,
            estado: params.datosCompra.estado,
            vendedor: params.datosCompra.vendedor,
            id: params.datosCompra.id,
            listaProductos: array,
            listaProductosAntiguos: array,
            compra_n: params.datosCompra.compra_n
        }))
        setTimeout(() => {
            calcularTotales(array, params.datosCompra.toppings)
        }, 100);

    }

    function calcularTotales(prods, toppings) {
        //totales venta
        let totalVenta = 0
        prods.forEach(element => {
            element.subtotalProducto = redondear(parseInt(element.precio) * parseInt(element.cantidad))
            const tops = []
            let subTops = 0
            toppings.forEach(element1 => {
                if (element1.fk_producto == element.id) {
                    element1.subtotalTopping = redondear(parseInt(element1.valor) * parseInt(element1.cantidad))
                    subTops = redondear((subTops + element1.subtotalTopping) * element.cantidad)
                    tops.push(element1)
                }
            })
            element.topping = tops
            element.subTodo = redondear(element.subtotalProducto + subTops)
            totalVenta = redondear(totalVenta + element.subTodo)
        })
        setDatosCompra((valores) => ({
            ...valores,
            listaProductos: prods,
            domicilio: getCostoEnvio(totalVenta),
            total_compra: totalVenta,
            costo_medio_pago: totalizarModoDepago(totalVenta)
        }))
    }

    function redondear(num) {
        return Math.round(num / 100) * 100;
    }

    function totalizarModoDepago(subtotal) {
        let totalModoDepago = 0;
        /*
        if (datosCompra.medio_de_pago !== 'Efectivo') {
            const porcentaje = params.datosPagina.comision_pasarela_pagos / 100
            totalModoDepago = parseFloat(porcentaje) * parseFloat(subtotal)
        }
        */
        return totalModoDepago
    }

    function alert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
        })
    }

    function getCostoEnvio(sub) {
        let envio = 0;
        if (datosCompra.cliente != '') {
            //  envio = params.datosPagina.valor_envio
        } else {
            // alert('Seleccionar un cliente para calcular el envio!')
        }
        return envio
    }

    function setFecha() {
        var fecha = new Date(); //Fecha actual
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear(); //obteniendo año
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes //agrega cero si el menor de 10
        document.getElementById('inputDate').value = ano + "-" + mes + "-" + dia
        setTimeout(() => {
            if (datosCompra.fecha === '') {
                setDatosCompra((valores) => ({
                    ...valores,
                    fecha: ano + "-" + mes + "-" + dia
                }))
            }
        }, 100);
    }

    function getCliente(e) {
        let nombre = ''
        let cedula = ''
        for (let i = 0; i < params.clientes.length; i++) {
            if (e.target.value == params.clientes[i].cedula) {
                nombre = params.clientes[i].nombre
                cedula = params.clientes[i].cedula
            }
        }
        setDatosCompra((valores) => ({
            ...valores,
            cliente: cedula,
            nombreCliente: nombre
        }))
    }

    function cambioFecha(e) {
        setDatosCompra((valores) => ({
            ...valores,
            fecha: e.target.value
        }))
    }

    function validarDatosVacio() {
        if (datosCompra.total_compra === 0 || datosCompra.listaProductos.length === 0) {
            alert('Faltan datos importantes!')
        } else {
            // Uso fetch porque enviar la lista de productos comprados por inputs es mas tedioso.....
            loadingOn()
            if (datosCompra.id == '') {
                fetchRegistrarCompra()
            } else {
                fetchUpdateCompra()
            }
        }
    }

    function fetchUpdateCompra() {
        const url = params.globalVars.myUrl + 'shopping/actualizar?_token=' + params.token
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(datosCompra),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            if (json == 'updated') {
                loadingOff()
                successAlert('Venta actualizada')
                document.getElementById('goShoppingIndex').click()
            }
        })
    }

    function successAlert(estado) {
        Swal.fire({
            title: estado,
            icon: 'success',
            timer: 1000
        })
    }

    function fetchRegistrarCompra() {
        const url = params.globalVars.myUrl + 'shopping/save?_token=' + params.token
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(datosCompra),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            if (json == 'ok') {
                document.getElementById('goShoppingIndex').click()
            }
        })
    }

    function loadingOn() {
        document.getElementById('btnIngresarCompra').style.display = 'none'
        document.getElementById('btnLoading').style.display = 'inline'
    }

    function loadingOff() {
        document.getElementById('btnIngresarCompra').style.display = 'inline'
        document.getElementById('btnLoading').style.display = 'none'
    }

    function cambiarModoPago(e) {
        setDatosCompra((valores) => ({
            ...valores,
            medio_de_pago: e.target.value
        }))
    }

    const cambioComentarioProducto = (inputId) => {
        const input = document.getElementById('inputComment' + inputId)
        reiniciarProductos()
        setTimeout(() => {
            const updatedArray = datosCompra.listaProductos.map(p =>
                p.id === inputId ? { ...p, descripcion: input.value }
                    : p
            )
            calcularTotales(updatedArray, toppingSelected)
        }, 100);
    }

    function getProducto(idProd) {
        if (validarInventario(idProd)) {
            return
        }
        let nombre = ''
        let precio = 0
        for (let i = 0; i < params.productos.length; i++) {
            if (idProd == params.productos[i].id) {
                nombre = params.productos[i].nombre
                precio = params.productos[i].valor
            }
        }
        let objeto = {
            id: idAutoIncrement,
            codigo: idProd,
            nombre: nombre,
            descripcion: '',
            cantidad: 1,
            precio: precio
        }
        setIdAutoIncrement(idAutoIncrement + parseInt(1))
        return objeto
    }

    function addTopping(e) {
        setProductToTopping(getProducto(e.target.value))
    }

    function addExtraTopping(item) {
        setProductToTopping(item)
        setWindowDisplay('4')
    }

    function addToCar(e) {
        let array = datosCompra.listaProductos
        let newProd = getProducto(e.target.value)
        if (newProd != undefined) {
            array.push(getProducto(e.target.value))
            reiniciarProductos()
            calcularTotales(array, toppingSelected)
        }
    }

    function reiniciarToppings() {
        let reiniciar = []
        setTopppingSelected(reiniciar)
    }

    function validarEnToppigSelected(top) {
        let topping = {}
        toppingSelected.forEach(element => {
            if (element.fk_producto == productToTopping.id) {
                if (element.nombre == top.nombre) {
                    topping = element
                }
            }
        })
        return topping
    }

    function masCantTopping(top) {
        setLoadingTops('')
        const validar = validarEnToppigSelected(top)
        if (Object.keys(validar).length > 0) {
            validar.nuevaCantidad = 1
            //Actualiza
            fetchActToppingToCar(validar)
        } else {
            top.cant = 1
            //validar si idCart y adjuntarlo
            if (toppingSelected.length == 0) {
                top.idCart = ''
            } else {
                top.idCart = toppingSelected[0].idCart
            }
            let datos = {
                'top': top,
                'prod': productToTopping
            }
            if (validarInventario(productToTopping.id)) {
                return
            }
            //Ingresa por primera vez
            fetchToppingToCar(datos)
        }
    }

    function fetchActToppingToCar(obj) {
        const url = params.globalVars.myUrl + 'toppingtocar/actualizar?_token=' + params.token
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            reiniciarToppings()
            setTopppingSelected(json)
            calcularTotales(datosCompra.listaProductos, json)
            setLoadingTops('none')
        })
    }

    function fetchActSuperCantToppingToCar(obj) {
        const url = params.globalVars.myUrl + 'toppingtocar/actualizar/supercant?_token=' + params.token
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            reiniciarToppings()
            setTopppingSelected(json)
            calcularTotales(datosCompra.listaProductos, json)
            setLoadingTops('none')
        })
    }

    function fetchToppingToCar(obj) {
        const url = params.globalVars.myUrl + 'toppingtocar/save?_token=' + params.token
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            reiniciarToppings()
            setTopppingSelected(json)
            let array = datosCompra.listaProductos
            if (array.length == 0) {
                array.push(productToTopping)
            } else {
                let ifExist = null
                array.forEach(element => {
                    if (element.id == productToTopping.id) {
                        ifExist = element
                    }
                })
                if (ifExist == null) {
                    array.push(productToTopping)
                }
            }
            reiniciarProductos()
            setDatosCompra((valores) => ({
                ...valores,
                listaProductos: array
            }))
            calcularTotales(array, json)
            setLoadingTops('none')
        })
    }

    function menosCantTopping(top) {
        const validar = validarEnToppigSelected(top)
        if (validar.cantidad > 0) {
            setLoadingTops('')
            validar.nuevaCantidad = -1
            fetchActToppingToCar(validar)
        }
    }

    function setSuperCantTopping(item) {
        setLoadingTops('')
        const validar = validarEnToppigSelected(item.item)
        if (Object.keys(validar).length > 0) {
            validar.nuevaCantidad = item.cant
            //Actualiza ingresando la cantidad directamente
            fetchActSuperCantToppingToCar(validar)
        } else {
            //validar idCart
            if (toppingSelected.length == 0) {
                item.item.idCart = ''
            } else {
                item.item.idCart = toppingSelected[0].idCart
            }
            item.item.cant = item.cant
            let datos = {
                'top': item.item,
                'prod': productToTopping
            }
            if (validarInventario(productToTopping.id)) {
                return
            }
            fetchToppingToCar(datos)
        }
    }

    function reiniciarProductos() {
        let reiniciar = []
        setDatosCompra((valores) => ({
            ...valores,
            listaProductos: reiniciar
        }))
    }

    function borrarProducto(id) {
        if (toppingSelected.length > 0) {
            const url = params.globalVars.myUrl + 'toppingtocar/' + id + '/' + toppingSelected[0].idCart
            fetch(url).then((response) => {
                return response.json()
            }).then((json) => {
                reiniciarToppings()
                setTopppingSelected(json)
                const temp = datosCompra.listaProductos.filter((art) => art.id !== id)
                calcularTotales(temp, json)
            })
        } else {
            const temp = datosCompra.listaProductos.filter((art) => art.id !== id)
            calcularTotales(temp, toppingSelected)
        }
    }

    function borrarTopping(id) {
        const url = params.globalVars.myUrl + 'toppingtocar/borrarone/' + id + '/' + toppingSelected[0].idCart
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            reiniciarToppings()
            setTopppingSelected(json)
            calcularTotales(datosCompra.listaProductos, json)
        })
    }

    function validarcantidad(id) {
        let validarCantidad = 0
        for (let i = 0; i < datosCompra.listaProductos.length; i++) {
            if (datosCompra.listaProductos[i].codigo === id) {
                validarCantidad = datosCompra.listaProductos[i].cantidad
            }
        }
        return validarCantidad
    }

    function menosCant(item) {
        if (validarcantidad(item.codigo) > 1) {
            reiniciarProductos()
            setTimeout(() => {
                datosCompra.listaProductos.forEach(element => {
                    if (element.id == item.id) {
                        element.cantidad = element.cantidad - 1
                    }
                });
                calcularTotales(datosCompra.listaProductos, toppingSelected)
            }, 100);
        }
    }

    function validarInventario(id) {
        let cantidadEnInventario = 0
        let boolean = false
        params.productos.forEach(element => {
            if (element.id == id) {
                cantidadEnInventario = element
            }
        });
        let cantCarrito = 0
        datosCompra.listaProductos.forEach(element => {
            if (element.codigo == id) {
                cantCarrito = element.cantidad
            }
        })
        const nuevaCantidad = parseInt(cantCarrito) + parseInt(1)
        if (cantidadEnInventario.cantidad < nuevaCantidad && cantidadEnInventario.cantidad != null) {
            alert('Hay ' + cantidadEnInventario.cantidad + " unidades en inventario!")
            boolean = true
        }
        return boolean
    }

    function masCant(item) {
        if (validarInventario(item.codigo)) {
            return
        }
        reiniciarProductos()
        setTimeout(() => {
            const updatedArray = datosCompra.listaProductos.map(p =>
                p.id === item.id ? { ...p, cantidad: parseInt(p.cantidad) + 1 }
                    : p
            )
            calcularTotales(updatedArray, toppingSelected)
        }, 100);
    }

    function cambioCant(item) {
        reiniciarProductos()
        setTimeout(() => {
            datosCompra.listaProductos.forEach(element => {
                if (element.id == item.id) {
                    element.cantidad = parseInt(item.cantidad)
                }
            });
            calcularTotales(datosCompra.listaProductos, toppingSelected)
        }, 100);
    }

    function cambioCostoEnvio(e) {
        setDatosCompra((valores) => ({
            ...valores,
            domicilio: e.target.value,
        }))
    }

    function validarCliente() {
        getCostoEnvio(datosCompra.total_compra)
    }

    function cambioCostoMedioPago(e) {
        setDatosCompra((valores) => ({
            ...valores,
            costo_medio_pago: e.target.value,
        }))
    }

    function cambioRecibido(e) {
        let cambio = parseInt(e.target.value) - (parseInt(datosCompra.total_compra) + parseInt(datosCompra.domicilio))
        setDatosCompra((valores) => ({
            ...valores,
            dinerorecibido: e.target.value,
            cambio: cambio
        }))
    }

    function cambioComentario(e) {
        setDatosCompra((valores) => ({
            ...valores,
            comentarios: e.target.value,
        }))
    }

    function cambioComentarioCliente(e) {
        setDatosCompra((valores) => ({
            ...valores,
            comentario_cliente: e.target.value,
        }))
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
            <Head title="Productos" />
            <div className="container">
                <a id='goShoppingIndex' style={{ display: 'none' }} href={route('shopping.index')}></a>
                <div style={{ textAlign: 'center', marginTop: '0.2em', display: windowDisplay == '4' ? 'none' : '' }} className="container">
                    <button onClick={() => setWindowDisplay('1')} style={{ textTransform: 'uppercase', margin: '0.4em', display: windowDisplay == '1' ? 'none' : '' }} className='btn btn-primary btn-sm'>Seleccionar productos</button>
                    <button onClick={() => setWindowDisplay('2')} style={{ textTransform: 'uppercase', margin: '0.4em', display: windowDisplay == '2' ? 'none' : '', backgroundColor: '#0ea6ab' }} className='btn btn-primary btn-sm'>Resumen carrito</button>
                    <PrimaryButton style={{ margin: '0.4em', display: windowDisplay == '3' ? 'none' : '' }} onClick={() => setWindowDisplay('3')} className="btn btn-success" >Revisar venta</PrimaryButton>
                </div>
                <div style={{ marginTop: '0.2em', display: windowDisplay == '3' ? '' : 'none' }} className='row justify-content-center'>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <h6 style={{ marginTop: '0.2em' }}>Fecha de venta:</h6>
                        <input type="date" className='rounded' onChange={cambioFecha} name="fecha" id="inputDate" />
                        <br />
                        <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.4em' }}>Seleccionar cliente (Opcional)</p>
                        <SelectClientes getCliente={getCliente} clientes={params.clientes}></SelectClientes>
                        <input type="text" style={{ marginTop: '0.2em' }} readOnly id='inputNombre' className="form-control rounded" value={datosCompra.nombreCliente == '' ? '' : datosCompra.nombreCliente} />
                        <textarea style={{ marginTop: '0.4em', display: 'none' }} name='comentario_cliente' placeholder='Comentario cliente...' onChange={cambioComentarioCliente} className="form-control rounded" value={datosCompra.comentario_cliente}></textarea>
                        <div style={{ textAlign: 'center' }} onMouseOver={validarCliente}>
                            <ShoppingCart productosCarrito={datosCompra.listaProductos} ></ShoppingCart>
                        </div>
                        <textarea name='comentarios' placeholder='Comentarios venta...' onChange={cambioComentario} className="form-control rounded" value={datosCompra.comentarios}></textarea>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <div style={{ textAlign: 'center', marginTop: '0.2em' }} className="border border-success rounded">
                            <h6 style={{ textAlign: 'center', marginTop: '0.4em' }}>Valor total productos</h6>
                            <h6 style={{ color: 'green', textAlign: 'center', marginBottom: '0.4em' }}>$ {glob.formatNumber(datosCompra.total_compra)}</h6>
                            <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                            <h6 style={{ marginTop: '0.4em' }}>Costo envio</h6>
                            <input className="form-control rounded" name='domicilio' type='number' onChange={cambioCostoEnvio} min="0" max="1000000" value={datosCompra.domicilio}></input>
                            <h6 style={{ texAlign: 'center', marginTop: '0.4em' }}>Total con envio</h6>
                            <h6 style={{ color: 'green', textAlign: 'center', marginBottom: '0.4em' }}>$ {glob.formatNumber(parseInt(datosCompra.total_compra) + parseInt(datosCompra.domicilio))}</h6>
                            <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                            <div style={{ padding: '0.6em' }}>
                                Forma de pago:
                                <select onChange={cambiarModoPago} name='categoria' id='selectCate' className="form-select rounded" >
                                    {opcionesPago.map((item, index) => {
                                        return (
                                            <option key={index} value={item} selected={item === datosCompra.medio_de_pago}>{item}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <h6 style={{ textAlign: 'center', display: 'none' }}>Costo medio de pago</h6>
                            <input name='medio_de_pago' type='hidden' className="form-control rounded" onChange={cambioCostoMedioPago} style={{ color: 'green', textAlign: 'center' }} value={datosCompra.costo_medio_pago}></input>
                            <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                            <h5 style={{ textAlign: 'center', marginTop: '0.4em' }}>Total a pagar</h5>
                            <h5 style={{ color: 'green', textAlign: 'center', marginBottom: '0.4em' }}>$ {glob.formatNumber(parseInt(datosCompra.total_compra) + parseInt(datosCompra.domicilio) + parseInt(datosCompra.costo_medio_pago))}</h5>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1.5em' }} className="border border-danger rounded">
                            <h5 style={{ textAlign: 'center', marginTop: '0.4em' }}>Dinero recibido</h5>
                            <input className="form-control rounded" type='number' name='dinerorecibido' onChange={cambioRecibido} defaultValue={datosCompra.dinerorecibido}></input>
                            <h5 style={{ textAlign: 'center', marginTop: '0.4em' }}>Cambio</h5>
                            <input className="form-control rounded" type='number' name='cambio' style={{ color: 'red', marginBottom: '0.4em' }} value={datosCompra.cambio == '' ? '0' : glob.formatNumber(parseInt(datosCompra.cambio))}></input>
                        </div>
                    </div>
                    <div style={{ margin: '1em' }} align='center' className='container'>
                        <PrimaryButton id='btnIngresarCompra' className='btn btn-success' onClick={validarDatosVacio} type='button'>{datosCompra.id == '' ? 'Ingresar venta' : 'Editar venta'}</PrimaryButton>
                        <button id='btnLoading' style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                    </div>
                </div>
                <div style={{ display: windowDisplay == '2' ? '' : 'none' }}>
                    <DialogoShoppingCart addExtraTopping={addExtraTopping} borrarTopping={borrarTopping} setWindowDisplay={setWindowDisplay} cambioComentarioProducto={cambioComentarioProducto} cambioCant={cambioCant} masCant={masCant} menosCant={menosCant} borrarProducto={borrarProducto} productosCarrito={datosCompra.listaProductos} productos={params.productos} editando={datosCompra.id}></DialogoShoppingCart>
                </div>
                <div style={{ display: windowDisplay == '1' ? '' : 'none' }}>
                    <ShowProducts setWindowDisplay={setWindowDisplay} globalVars={params.globalVars} categorias={params.categorias} productos={params.productos} addToCar={addToCar} addTopping={addTopping}></ShowProducts>
                </div>
                <div style={{ display: windowDisplay == '4' ? '' : 'none' }}>
                    <AddToppings categorias={params.categoriasAdiciones} setSuperCantTopping={setSuperCantTopping} loadingTops={loadingTops} menosCantTopping={menosCantTopping} masCantTopping={masCantTopping} globalVars={params.globalVars} adiciones={params.adiciones} toppingSelected={toppingSelected} setWindowDisplay={setWindowDisplay} productToTopping={productToTopping} ></AddToppings>
                </div>
            </div>
            <DialogoLoading url={params.globalVars.myUrl}></DialogoLoading>
        </AuthenticatedLayout>
    )
}

export default NuevaCompra