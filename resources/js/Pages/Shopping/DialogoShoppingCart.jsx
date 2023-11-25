import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import Swal from 'sweetalert2'
import SuperCantModal from './SuperCantModal';

const DialogoShoppingCart = (params) => {
    const glob = new GlobalFunctions()
    const [productos, setProductos] = useState([])
    const [idEliminar, setIdEliminar] = useState('')
    const [idEliminarTopping, setIdEliminarTopping] = useState('')
    const [superCantidad, setSuperCantidad] = useState({
        id: '',
        cantidad: ''
    })

    useEffect(() => {
        revisarDatos()
    })

    function revisarDatos() {
        if (params.productosCarrito.length != productos.length) {
            setProductos(params.productosCarrito)
        }
    }

    function abrirDialogoElimininar(item) {
        setIdEliminar(item.id)
        Swal.fire({
            title: '¿Eliminar ' + item.nombre + ' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!',
            reverseButtons: false
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('inputGoNuevaCompra').click()
            }
        })
    }

    function abrirDialogoElimininarTopping(top) {
        setIdEliminarTopping(top.id)
        Swal.fire({
            title: '¿Eliminar ' + top.nombre + ' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!',
            reverseButtons: false
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('inputEliminarTopping').click()
            }
        })
    }

    function validarInventario(item) {
        let mostrar = ''
        //validar si se esta editando: validar si mostrar
        if (params.editando != '') {
            params.productos.forEach(element => {
                let encontrarProducto = null
                if (element.id == item.codigo) {
                    encontrarProducto = element
                    // si cantidad en productos no es null no mostrar
                    if (element.cantidad != null) {
                        mostrar = 'none'
                    }
                }
            });
        }
        return mostrar
    }

    function setCodSuperCant(item) {
        setSuperCantidad((valores) => ({
            ...valores,
            id: item.id,
            cantidad: item.cantidad
        }))
    }

    function cambioSuperCant(e) {
        setSuperCantidad((valores) => ({
            ...valores,
            cantidad: e.target.value
        }))
    }

    function sweetAlertComment(item) {
        Swal.fire({
            title: 'Comentario producto',
            input: 'textarea',
            inputValue: item.descripcion,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonColor: 'green',
            confirmButtonText: 'Agregar',
            reverseButtons: true,
            preConfirm: (comentario) => {
                document.getElementById('inputComment' + item.id).value = comentario
                document.getElementById('inputComment' + item.id).click()
            }
        })
    }

    return (
        <div >
            <div style={{ margin: '0.2em' }} >
                <input type='hidden' id='inputGoNuevaCompra' onClick={() => params.borrarProducto(idEliminar)} ></input>
                <input type='hidden' id='inputEliminarTopping' onClick={() => params.borrarTopping(idEliminarTopping)} ></input>
                <div className="row" style={{ color: 'green', marginTop: '0.4em' }}>
                    <div className="align-self-center">
                        <h1 style={{ marginTop: '0.5em', fontSize: '1.2em', color: 'black' }} className="text-center">Carrito de compras</h1>
                    </div>
                </div>
                <div style={{ marginTop: '0.2em' }} className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Valor</th>
                                <th scope="col">Cant</th>
                                <th scope="col">Subtotal</th>
                                <th scope="col">Sumar</th>
                                <th scope="col">Restar</th>
                                <th scope="col">Adicionar topping</th>
                                <th scope="col">Borrar</th>
                            </tr>
                        </thead>
                        {productos.map((item, index) => {
                            return (
                                <thead key={index}>
                                    <tr className='align-middle'  >
                                        <td>{item.nombre}</td>
                                        <td>${glob.formatNumber(item.precio)}</td>
                                        <td>
                                            <button onClick={() => setCodSuperCant(item)} data-toggle="modal" data-target="#cantModal" className='btn btn-outline-success'>{item.cantidad}</button>
                                        </td>
                                        <td>${glob.formatNumber(item.subtotalProducto)}</td>
                                        <td>
                                            <button style={{ display: validarInventario(item) }} onClick={() => params.menosCant(item)} className="btn btn-light btn-sm">
                                                <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-dash-square" viewBox="0 0 16 16">
                                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td>
                                            <button style={{ display: validarInventario(item) }} onClick={() => params.masCant(item)} className="btn btn-light btn-sm">
                                                <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td>
                                            <div onClick={() => params.addExtraTopping(item)} style={{ cursor: 'pointer' }} className="form-check btn btn-outline-success btn-sm">
                                                <button className='align-middle' >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-plus-square-dotted" viewBox="0 0 16 16">
                                                        <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                                    </svg>
                                                </button>
                                                <label style={{ marginLeft: '0.3em', cursor: 'pointer', fontWeight: 'bold' }} className="form-check-label" htmlFor="defaultCheck1">
                                                    Topping
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <button onClick={() => abrirDialogoElimininar(item)} className='btn btn-danger btn-sm'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr style={{ display: item.topping.length > 0 ? '' : 'none' }}>
                                        <td colSpan='2'></td>
                                        <th scope="col">Topping</th>
                                        <th scope="col">Cant</th>
                                        <th scope="col">Borrar</th>
                                        <td colSpan='3'></td>
                                    </tr>
                                    {item.topping ?
                                        item.topping.map((top, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td colSpan='2'></td>
                                                    <td>{top.nombre}</td>
                                                    <td>{top.cantidad}</td>
                                                    <td>
                                                        <button onClick={() => abrirDialogoElimininarTopping(top)} className='btn btn-danger btn-sm'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                    <td colSpan='3'></td>
                                                </tr>
                                            )
                                        })
                                        :
                                        ''
                                    }
                                    <tr>
                                        <td colSpan={'8'}>
                                            <input type='hidden' id={'inputComment' + item.id} onClick={() => params.cambioComentarioProducto(item.id)}></input>
                                            <textarea rows={'1'} placeholder='Comentarios producto...' onClick={() => sweetAlertComment(item)} className="form-control" defaultValue={item.descripcion}></textarea>
                                        </td>
                                    </tr>
                                </thead>
                            )
                        })}
                    </table>
                </div>
            </div>
            <SuperCantModal cambioSuperCant={cambioSuperCant} superCantidad={superCantidad} cambioCant={() => params.cambioCant(superCantidad)}></SuperCantModal>
        </div >
    )
}

export default DialogoShoppingCart