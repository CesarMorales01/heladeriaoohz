import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import SelectClientes from './SelectClientes';
import SelectProductos from './SelectProductos';
import ShoppingCart from './ShoppingCart';
import PrimaryButton from '@/Components/PrimaryButton'
import '../../../css/general.css'

const NuevaCompra = (params) => {
    const glob = new GlobalFunctions()
    const [datosCompra, setDatosCompra] = useState({
        cliente: '',
        nombreCliente: '',
        fecha: '',
        total_compra: 0,
        domicilio: 0,
        medio_de_pago: 'Efectivo',
        costo_medio_pago: 0,
        comentarios: '',
        cambio: '',
        estado: 'Recibida',
        vendedor: '',
        listaProductos: [],
        listaProductosAntiguos: [],
        id: '',
        compra_n: ''
    })

    useEffect(() => {
        if (params.datosCompra.id == '') {
            setFecha()
        } else {
            if (datosCompra.cliente == '') {
                cargarParametros()
            }
        }
    }, [])

    useEffect(() => {
        if (datosCompra.listaProductos.length > 0) {
            calcularTotales(datosCompra.listaProductos)
            setCheckedRadioPagos()
        }
    }, [datosCompra.medio_de_pago])

    function cargarParametros() {
        let array = []
        for (let i = 0; i < params.datosCompra.listaProductos.length; i++) {
            let objeto = {
                codigo: params.datosCompra.listaProductos[i].codigo,
                nombre: params.datosCompra.listaProductos[i].producto,
                cantidad: params.datosCompra.listaProductos[i].cantidad,
                precio: params.datosCompra.listaProductos[i].precio
            }
            array.push(objeto)
        }
        document.getElementById('inputDate').value = params.datosCompra.fecha
        setDatosCompra((valores) => ({
            ...valores,
            fecha: params.datosCompra.fecha,
            cliente: params.datosCompra.cliente.cedula,
            nombreCliente: params.datosCompra.cliente.nombre,
            total_compra: params.datosCompra.total_compra,
            domicilio: params.datosCompra.domicilio,
            medio_de_pago: params.datosCompra.medio_de_pago,
            comentarios: params.datosCompra.comentarios,
            estado: params.datosCompra.estado,
            vendedor: params.datosCompra.vendedor,
            id: params.datosCompra.id,
            listaProductos: array,
            listaProductosAntiguos: array,
            compra_n: params.datosCompra.compra_n
        }))
        setTimeout(() => {
            calcularTotales(array)
        }, 100);
    }

    function calcularTotales(prods) {
        let totales = {
            subtotal: 0,
            costoEnvio: 0,
            costoMedioPago: 0
        }
        // subtotal
        for (let i = 0; i < prods.length; i++) {
            totales.subtotal = totales.subtotal + prods[i].cantidad * prods[i].precio
        }
        //costo envio
        totales.costoEnvio = getCostoEnvio(totales.subtotal)

        totales.costoMedioPago = totalizarModoDepago(totales.subtotal)
        setDatosCompra((valores) => ({
            ...valores,
            domicilio: totales.costoEnvio,
            total_compra: totales.subtotal,
            costo_medio_pago: totales.costoMedioPago
        }))
    }

    function totalizarModoDepago(subtotal) {
        setCheckedRadioPagos()
        let totalModoDepago = 0;
        if (datosCompra.medio_de_pago !== 'Efectivo') {
            const porcentaje = params.datosPagina.comision_pasarela_pagos / 100
            totalModoDepago = parseFloat(porcentaje) * parseFloat(subtotal)
        }
        return totalModoDepago
    }

    function setCheckedRadioPagos() {
        if (datosCompra.medio_de_pago === 'Efectivo') {
            document.getElementById('contraentrega').checked = true
            document.getElementById('wompi').checked = false
        } else {
            document.getElementById('wompi').checked = true
            document.getElementById('contraentrega').checked = false
        }
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
        console.log(url)
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

    function cambiarModoPago(metodo) {
        setDatosCompra((valores) => ({
            ...valores,
            medio_de_pago: metodo
        }))
    }

    function getProducto(e) {
        let validarSiListaProductos = false
        datosCompra.listaProductos.map(p =>
            p.codigo === e.target.value ? validarSiListaProductos = true : validarSiListaProductos = false
        )
        if (validarSiListaProductos) {
            masCant(e.target.value)
        } else {
            if(validarInventario(e.target.value)){
                return
            }
            let nombre = ''
            let precio = 0
            for (let i = 0; i < params.productos.length; i++) {
                if (e.target.value == params.productos[i].id) {
                    nombre = params.productos[i].nombre
                    precio = params.productos[i].valor
                }
            }
            let array = datosCompra.listaProductos
            let objeto = {
                codigo: e.target.value,
                nombre: nombre,
                cantidad: 1,
                precio: precio
            }
            array.push(objeto)
            reiniciarProductos()
            setTimeout(() => {
                setDatosCompra((valores) => ({
                    ...valores,
                    listaProductos: array
                }))
                calcularTotales(array)
            }, 100);
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
        let array = datosCompra.listaProductos
        reiniciarProductos()
        setTimeout(() => {
            const temp = array.filter((art) => art.codigo !== id);
            setDatosCompra((valores) => ({
                ...valores,
                listaProductos: temp
            }))
            // Paso array temp a calcularTotales porque setDatosCompra demora un poco en actualizar....
            calcularTotales(temp)
        }, 100);
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

    function menosCant(id) {
        if (validarcantidad(id) > 1) {
            const temp = datosCompra.listaProductos
            reiniciarProductos()
            setTimeout(() => {
                const updatedArray = temp.map(p =>
                    p.codigo === id ? { ...p, cantidad: p.cantidad - 1 }
                        : p
                )
                setDatosCompra((valores) => ({
                    ...valores,
                    listaProductos: updatedArray
                }))
                calcularTotales(updatedArray)
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
        console.log(cantCarrito)
        if (cantidadEnInventario.cantidad < cantCarrito + 1 && cantidadEnInventario.cantidad != null) {
            alert('Hay ' + cantidadEnInventario.cantidad + " unidades en inventario!")
            boolean = true
        }
        return boolean
    }

    function masCant(id) {
        if (validarcantidad(id) < 100) {
            if (validarInventario(id)) {
                return
            }
            const temp = datosCompra.listaProductos
            reiniciarProductos()
            setTimeout(() => {
                const updatedArray = temp.map(p =>
                    p.codigo === id ? { ...p, cantidad: parseInt(p.cantidad)+ 1 }
                        : p
                )
                setDatosCompra((valores) => ({
                    ...valores,
                    listaProductos: updatedArray
                }))
                calcularTotales(updatedArray)
            }, 100);
        } else {
            alert('La cantidad máxima de productos es 100!')
        }
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

    function cambioComentario(e) {
        setDatosCompra((valores) => ({
            ...valores,
            comentarios: e.target.value,
        }))
    }

    return (
        <AuthenticatedLayout user={params.auth} info={params.datosPagina} urlImagenes={params.globalVars.urlImagenes}>
            <Head title="Productos" />
            <div className="container">
                <a id='goShoppingIndex' style={{ display: 'none' }} href={route('shopping.index')}></a>
                <div style={{ marginTop: '0.2em' }} className='row justify-content-center'>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <h6 style={{ marginTop: '0.2em' }}>Fecha de compra:</h6>
                        <input type="date" onChange={cambioFecha} name="fecha" id="inputDate" />
                        <br />
                        <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.4em' }}>Seleccionar cliente</p>
                        <SelectClientes getCliente={getCliente} clientes={params.clientes}></SelectClientes>
                        <input type="text" style={{ marginTop: '0.2em' }} readOnly id='inputNombre' className="form-control" value={datosCompra.nombreCliente == '' ? '' : datosCompra.nombreCliente} />
                        <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.4em' }}>Seleccionar productos</p>
                        <div onMouseOver={validarCliente}>
                            <SelectProductos obtenerProducto={getProducto} productos={params.productos}></SelectProductos>
                            <ShoppingCart masCant={masCant} menosCant={menosCant} borrarProducto={borrarProducto} productosCarrito={datosCompra.listaProductos}></ShoppingCart>
                        </div>
                        <textarea name='comentarios' placeholder='Comentarios...' onChange={cambioComentario} className="form-control" value={datosCompra.comentarios}></textarea>
                    </div>

                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <div style={{ textAlign: 'center', marginTop: '0.2em' }} className="border border-success">
                            <h6 style={{ textAlign: 'center', marginTop: '0.4em' }}>Valor total productos</h6>
                            <h6 style={{ color: 'green', textAlign: 'center', marginBottom: '0.4em' }}>$ {glob.formatNumber(datosCompra.total_compra)}</h6>
                            <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                            <h6 style={{ marginTop: '0.4em' }}>Costo envio</h6>
                            <input className="form-control" name='domicilio' type='number' onChange={cambioCostoEnvio} min="0" max="1000000" value={datosCompra.domicilio}></input>
                            <h6 style={{ texAlign: 'center', marginTop: '0.4em' }}>Total con envio</h6>
                            <h6 style={{ color: 'green', textAlign: 'center', marginBottom: '0.4em' }}>$ {glob.formatNumber(parseInt(datosCompra.total_compra) + parseInt(datosCompra.domicilio))}</h6>
                            <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                            <h6 style={{ marginTop: '0.4em' }}>Forma de pago</h6>
                            <div style={{ padding: '1em' }} className='row'>
                                <div onClick={() => cambiarModoPago('Contraentrega')} style={{ padding: '1vh', cursor: 'pointer' }} className="container card col-6" >
                                    <div className='row'>
                                        <div className="col-6">
                                            <input type="radio" id="contraentrega" name="medio_pago" value="contraentrega" />
                                        </div>
                                        <div className="col-6">
                                            <span>Efectivo </span>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={() => cambiarModoPago('Electronico')} style={{ padding: '1vh', cursor: 'pointer', display: 'none' }} className="container card col-6" >
                                    <div className='row'>
                                        <div className="col-6">
                                            <input type="radio" id="wompi" name="medio_pago" value="wompi" />
                                        </div>
                                        <div className="col-6">
                                            <span>Pago en línea </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h6 style={{ textAlign: 'center', display: 'none' }}>Costo medio de pago</h6>
                            <input name='medio_de_pago' type='hidden' className="form-control" onChange={cambioCostoMedioPago} style={{ color: 'green', textAlign: 'center' }} value={datosCompra.costo_medio_pago}></input>
                            <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>

                            <h5 style={{ textAlign: 'center', marginTop: '0.4em' }}>Total a pagar</h5>
                            <h5 style={{ color: 'green', textAlign: 'center', marginBottom: '0.4em' }}>$ {glob.formatNumber(parseInt(datosCompra.total_compra) + parseInt(datosCompra.domicilio) + parseInt(datosCompra.costo_medio_pago))}</h5>
                        </div>
                    </div>
                    <div style={{ margin: '1em' }} align='center' className='container'>
                        <PrimaryButton id='btnIngresarCompra' className='btn btn-success' onClick={validarDatosVacio} type='button'>{datosCompra.id == '' ? 'Ingresar compra' : 'Editar compra'}</PrimaryButton>
                        <button id='btnLoading' style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    )
}

export default NuevaCompra