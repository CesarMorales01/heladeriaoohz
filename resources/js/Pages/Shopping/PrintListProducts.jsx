import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import logo from '../../../../public/Images/Config/logoFactura.jpeg'

const PrintLisTProducts = (params) => {
    const glob = new GlobalFunctions()

    useEffect(() => {
        setTimeout(() => {
            window.print()
        }, 100);
        setTimeout(() => {
            document.getElementById('divBack').style.display = ''
            document.getElementById('divPrint').style.display = ''
        }, 3000);
    }, [])

    function print() {
        window.print()
    }

    function validarApellido() {
        let ape = ''
        if (params.datosCompra.cliente != '') {
            if (params.datosCompra.cliente.apellidos != '') {
                ape = " " + params.datosCompra.cliente.apellidos
            }
        }
        return ape
    }

    return (
        <nav >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div id='divBack' style={{ display: 'none' }} className="shrink-0 flex items-center">
                            <a className='tamañoLetraNav inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150' href={route('shopping.index')} style={{ color: '#fd4cb9', cursor: 'pointer' }} > <i style={{ marginRight: '0.2em' }} className="fas fa-home fa-1x"></i>Back</a>
                        </div>
                        <div id='divPrint' style={{ marginLeft: '2em', display: 'none' }} className="shrink-0 flex items-center">
                            <button onClick={print} className='btn btn-outline-success'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <Head title={"Pedido-" + params.datosCompra.id} />
                <table className="table">
                    <thead>
                        <tr>
                            <th className="align-middle">
                                <img src={logo} alt="" width="120"
                                    height="120" />
                            </th>
                            <th className="align-middle">
                                <h4>Heladeria Oohz</h4>
                            </th>
                            <th className="align-middle">
                                <h4 style={{ fontSize: '16px' }}>Pedido N°</h4>
                                <p id="tv_factura_n">{params.datosCompra.id}</p>
                            </th>
                        </tr>
                    </thead>
                </table>
                <table className="table">
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th style={{ fontSize: '19px', fontWeight: 'bold' }} colSpan='3' className="align-middle">
                                Cliente
                            </th>
                        </tr>
                        <tr style={{ textAlign: 'center' }}>
                            <th className="align-middle">
                                Nombre
                            </th>
                            <th className="align-middle">
                                Comentario cliente
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ textAlign: 'center' }}>
                            <td>{params.datosCompra.cliente == '' ? '' : params.datosCompra.cliente.nombre}
                                {params.datosCompra.cliente == '' ? '' : validarApellido()}
                            </td>
                            <td>{params.datosCompra.comentario_cliente}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="row" style={{ marginTop: '0.4em' }}>
                    <div className="align-self-center">
                        <h5 style={{ textAlign: 'center', fontSize: '19px', fontWeight: 'bold' }} >Resumen carrito de compras</h5>
                    </div>
                </div>
                <div style={{ marginTop: '0.2em', textAlign: 'center' }} className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th colSpan='2' scope="col">Producto</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Comentarios</th>
                            </tr>
                        </thead>
                        {params.datosCompra.listaProductos.map((item, index) => {
                            return (
                                <thead key={index}>
                                    <tr className='align-middle'  >
                                        <td colSpan='2'>{item.producto}</td>
                                        <td>
                                            {item.cantidad}
                                        </td>
                                        <td>
                                            {item.descripcion}
                                        </td>
                                    </tr>
                                    <tr style={{ display: item.tops.length > 0 ? '' : 'none', fontSize: '14px', color: 'green' }}>
                                        <th ></th><th ></th>
                                        <th scope="col">Topping</th>
                                        <th scope="col">Cant</th>
                                        <th scope="col">Cant P</th>
                                    </tr>
                                    {item.tops ?
                                        item.tops.map((top, index) => {

                                            return (
                                                <tr style={{ fontSize: '14px', color: 'green' }} key={index}>
                                                    <td></td> <td></td>
                                                    <td>{top.nombre}</td>
                                                    <td>{top.cantidad}</td>
                                                    <td>(x {item.cantidad})</td>
                                                </tr>
                                            )
                                        })
                                        :
                                        ''
                                    }
                                </thead>
                            )
                        })}
                        <thead>
                            <tr>
                                <td className='align-middle' style={{ textAlign: 'center', fontSize: '19px', fontWeight: 'bold' }} colSpan={'2'}>Comentario compra</td>
                                <td colSpan={'2'}>{params.datosCompra.comentarios}</td>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </nav>
    )
}

export default PrintLisTProducts