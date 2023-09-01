import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import logo from '../../../../public/Images/Config/logoFactura.jpeg'

const PrintLisTProducts = (params) => {
    const glob = new GlobalFunctions()

    useEffect(() => {
          window.print()
          window.location=params.globalVars.myUrl+'shopping'
    }, [])

    function validarApellido(){
        let ape=''
        if(params.datosCompra.cliente!=''){
            if(params.datosCompra.cliente.apellidos!=''){
                ape=" "+params.datosCompra.cliente.apellidos
            }
        }
        return ape
    }

    return (
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
                        <th  className="align-middle">
                            Nombre
                        </th>
                        <th  className="align-middle">
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
                                        <textarea readOnly className='rounded' value={item.descripcion}></textarea>
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
                            <td style={{ textAlign: 'center', fontSize: '19px', fontWeight: 'bold' }} colSpan={'2'}>Comentario compra</td>
                            <td colSpan={'2'}>{params.datosCompra.comentarios}</td>
                        </tr>
                    </thead>
                </table>
                
                <br></br>
            </div>
        </div>
    )
}

export default PrintLisTProducts