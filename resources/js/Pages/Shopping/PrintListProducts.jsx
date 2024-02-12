import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react'

const PrintLisTProducts = (params) => {
    const glob = new GlobalFunctions()

    useEffect(() => {
        setTimeout(() => {
             window.print()
        }, 100);
        setTimeout(() => {
            document.getElementById('divBack').style.display = ''
        }, 3000);
        setTimeout(() => {
            document.getElementById('btnBack').click()
        }, 6000);
    }, [])

    function print() {
        window.print()
    }
    return (
        <nav >
            <Head title={"Pedido-" + params.datosCompra.id} />
            <div style={{ display: 'none' }} id='divBack' className="flex justify-between h-16">
                <div className="flex">
                    <div className="shrink-0 flex items-center">
                        <a id='btnBack' className='tamañoLetraNav inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150' href={route('shopping.index')} style={{ color: '#fd4cb9', cursor: 'pointer' }} > <i style={{ marginRight: '0.2em' }} className="fas fa-home fa-1x"></i>Back</a>
                    </div>
                    <div style={{ marginLeft: '2em' }} className="shrink-0 flex items-center">
                        <button onClick={print} className='btn btn-outline-success'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='row' style={{  width: '300px', fontSize: '30px', fontWeight: 'bold' }}>
                <h4 style={{ textAlign: 'center' }}>Pedido N° {params.datosCompra.id}</h4>
                <h4 >Cliente: {params.datosCompra.cliente.nombre}{params.datosCompra.cliente.apellidos != null ? ' '+params.datosCompra.cliente.apellidos : ''}</h4>
                {params.datosCompra.listaProductos.map((item, index) => {
                    return (
                        <div key={index} className='row border'>
                            <div className='col-10'>
                                <h3>{item.producto}</h3>
                            </div>
                            <div className='col-2'>
                                <h3 style={{ marginTop: item.producto.length>10 ? '60%': '' }}>{item.cantidad}</h3>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '24px' }} className='col-12'>
                                <h3 >{item.descripcion}</h3>
                            </div>
                            <div style={{ textAlign: 'center', display: item.tops.length > 0 ? '' : 'none', fontSize: '20px' }} className='row'>
                                <div className='col-6'>
                                    <h3>Topping</h3>
                                </div>
                                <div className='col-6'>
                                    <h3>Cant top...</h3>
                                </div>
                                {item.tops ?
                                    item.tops.map((top, index) => {
                                        return (
                                            <div className='row' key={index}>
                                                <div style={{ whiteSpace: 'nowrap' }} className='col-6'>
                                                    <h3>{top.nombre}</h3>
                                                </div>
                                                <div className='col-6'>
                                                    <h3>{top.cantidad}</h3>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    ''
                                }
                            </div>
                        </div>
                    )
                })}
                <p style={{ textAlign: 'center' }}>{params.datosCompra.comentarios}</p>
            </div>
        </nav>
    )
}

export default PrintLisTProducts