import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Pagination from '../Product/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DialogoCompraN from './DialogoCompraN';
import Swal from 'sweetalert2'
import DangerButton from '@/Components/DangerButton';

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

    return (
        <div className='container table-responsive'>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Detalle</th>
                        <th scope="col">Total venta</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Comentarios</th>
                        <th scope="col">Medio pago</th>
                        <th scope="col">Costo envio</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noCompras ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='9'>No se han encontrado resultados....</td></tr>
                        :
                        lista.map((item, index) => {
                            return (
                                <tr className='align-middle' key={index}>
                                    <th scope="row">
                                        {item.fecha}
                                    </th>
                                    <td>
                                        <a href={item.cedula!='' ? route('customer.editar', [item.cliente.cedula, 'nothing']) : ''} style={{ textDecoration: item.cedula!='' ? 'underline': '', color: 'blue' }} >{item.cliente.nombre}</a>
                                    </td>
                                    <td>
                                        <button style={{ backgroundColor: 'white', color: 'black' }} id='btnCompraN' onClick={() => abrirCompraN(item)} className='btn btn-outline-info rounded' type="button" data-toggle="modal" data-target="#dialogoCompraN">
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
                                    <td>{item.medio_de_pago}</td>
                                    <td>{glob.formatNumber(item.domicilio)}</td>
                                    <td>
                                        <a href={route('shopping.edit', item.cliente.cedula)} className='btn btn-success border' style={{ cursor: 'pointer' }} >
                                            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </a>
                                        <form style={{ marginTop: '0.2em' }} method="POST" id={item.id + "formEliminar"} onSubmit={preventDefault} action={route('shopping.store')}>
                                            <input type="hidden" name='_token' value={params.token} />
                                            <input type='hidden' name='cliente' value={item.cliente.cedula}></input>
                                            <input type='hidden' name='compran' value={item.compra_n}></input>
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