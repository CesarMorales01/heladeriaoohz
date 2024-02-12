import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Pagination from '../Product/Pagination';
import DialogoCompraN from './DialogoCompraN';
import Swal from 'sweetalert2'

const TablaListaCompras = (params) => {

    const [lista, setLista] = useState([])
    const glob = new GlobalFunctions()
    const optionsSelect = [
        { value: 'Recibida', label: 'Recibida' },
        { value: 'Preparando', label: 'Preparando' },
        { value: 'En camino', label: 'En camino' },
        { value: 'Entregada', label: 'Entregada' }
    ]
    const [datosCompra, setDatosCompra] = useState({})

    useEffect(() => {
        if (params.lista.length !== lista.length) {
            setLista(params.lista)
        }
    })

    function loadingOn(id) {
        document.getElementById(id).style.display = 'none'
        document.getElementById('btnLoadingSelect' + id).style.display = 'inline'
    }

    function loadingOff(id) {
        document.getElementById(id).style.display = 'inline'
        document.getElementById('btnLoadingSelect' + id).style.display = 'none'
    }

    function abrirCompraN(item) {
        setDatosCompra(item)
    }

    function cambioEstado(estado) {
        loadingOn(estado.target.id)
        const url = params.url + 'shopping/shoppingChangeState/' + estado.target.id + '/' + estado.target.value
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            loadingOff(estado.target.id)
            document.getElementById(estado.target.id).value = json
        })
    }

    function confirmarEliminar(id) {
        Swal.fire({
            title: '¿Eliminar esta compra?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                loadingOn(id)
                document.getElementById(id + 'formEliminar').submit()
            }
        })
    }

    function preventDefault(e) {
        e.preventDefault()
    }

    function validarSiCliente(valor) {
        let cliente = true
        if (isNaN(valor)) {
            cliente = false
        }
        return cliente
    }

    return (
        <div style={{ marginTop: '0.5em' }} className='table-responsive '>
            <table className="table table-striped roundedTable">
                <thead className='navBarFondo align-middle'>
                    <tr>
                        <th style={{ textAlign: 'center' }} scope="col">Fecha</th>
                        <th style={{ textAlign: 'center' }} scope="col">Cliente</th>
                        <th style={{ textAlign: 'center' }} scope="col">Detalle</th>
                        <th style={{ textAlign: 'center' }} scope="col">Total venta</th>
                        <th style={{ textAlign: 'center' }} scope="col">Estado</th>
                        <th style={{ textAlign: 'center' }} scope="col">Comentarios</th>
                        <th style={{ textAlign: 'center' }} scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noCompras ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='9'>No se han encontrado resultados....</td></tr>
                        :
                        lista.map((item, index) => {
                            let nombreCliente = ''
                            if (item.cliente.nombre != '') {
                                nombreCliente = item.cliente.nombre
                            }
                            if (item.cliente.nombre != '' && item.cliente.apellidos != null) {
                                nombreCliente = item.cliente.nombre + " " + item.cliente.apellidos
                            }
                            return (
                                <tr className='align-middle' key={index}>
                                    <th >
                                        {glob.formatInvertFecha(item.fecha)}
                                    </th>
                                    <td>
                                        <a href={validarSiCliente(item.cliente.nombre) ? '' : route('customer.editar', [item.cliente.cedula, 'nothing'])} style={{ textDecoration: item.cedula != '' ? 'underline' : '', color: 'blue' }} >{nombreCliente} </a>
                                    </td>
                                    <td>
                                        <button style={{ backgroundColor: 'white', color: 'black' }} onClick={() => abrirCompraN(item)} className='btn btn-outline-info rounded' type="button" data-toggle="modal" data-target="#dialogoCompraN">
                                            {item.listaProductos[0].producto} x{item.listaProductos[0].cantidad}...
                                        </button>
                                    </td>
                                    <td>{glob.formatNumber(item.total_compra)}</td>
                                    <td>
                                        <div style={{ width: '8em' }}>
                                            <select onChange={cambioEstado} id={item.id} value={item.estado} className="form-select form-select-sm rounded">
                                                {optionsSelect.map((opcion, index) => {
                                                    return (
                                                        <option key={index} value={opcion.label}>{opcion.label}</option>
                                                    )
                                                })}
                                            </select>
                                            <button id={'btnLoadingSelect' + item.id} style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {item.comentarios.substring(0, 60)}...
                                    </td>
                                    <td>
                                        <a href={route('shopping.printList', item.id)} className='btn btn-info border' style={{ cursor: 'pointer' }} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-checklist" viewBox="0 0 16 16">
                                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                                                <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                        </a>

                                        <a href={route('shopping.show', item.id)} className='btn btn-primary border' style={{ cursor: 'pointer' }} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                                            </svg>
                                        </a>
                                        <a href={route('shopping.edit', item.id)} className='btn btn-success border' style={{ cursor: 'pointer' }} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                            </svg>
                                        </a>
                                        <form style={{ marginTop: '0.2em' }} method="POST" id={item.id + "formEliminar"} onSubmit={preventDefault} action={route('shopping.store')}>
                                            <input type="hidden" name='_token' value={params.token} />
                                            <input type='hidden' name='idCompra' value={item.id}></input>
                                            <button type='submit' onClick={() => { confirmarEliminar(item.id) }} style={{ backgroundColor: 'red' }} className="btn btn-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <DialogoCompraN url={params.url} datos={datosCompra} />
            {params.noCompras ?
                ''
                :
                <Pagination class="mt-6" links={params.pagination} />
            }
        </div>
    )
}

export default TablaListaCompras