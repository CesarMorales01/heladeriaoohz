import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import Swal from 'sweetalert2'

const ShoppingCart = (params) => {
    const glob = new GlobalFunctions()
    const [productos, setProductos] = useState([])

    useEffect(() => {
        revisarDatos()
    })

    function revisarDatos() {
        if (params.productosCarrito.length != productos.length) {
            setProductos(params.productosCarrito)
        }
    }

    return (
        <div className='border'>
            <div className="row" style={{ color: 'green', marginTop: '0.4em' }}>
                <div className="align-self-center">
                    <h5 style={{ textAlign: 'center' }} >Resumen carrito de compras</h5>
                </div>
            </div>
            <div style={{ marginTop: '0.2em' }} className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th colSpan='2' scope="col">Producto</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Cant</th>
                            <th scope="col">Subtotal</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    {productos.map((item, index) => {

                        return (
                            <thead key={index}>
                                <tr className='align-middle'  >
                                    <td colSpan='2'>{item.nombre}</td>
                                    <td>${glob.formatNumber(item.precio)}</td>
                                    <td>
                                        {item.cantidad}
                                    </td>
                                    <td>${glob.formatNumber(item.subtotalProducto)}</td>
                                    <td></td>
                                </tr>
                                <tr style={{ display: item.topping.length > 0 ? '' : 'none', fontSize: '14px', color: 'green' }}>
                                    <th colSpan={'2'} scope="col"></th>
                                    <th scope="col">Topping</th>
                                    <th scope="col">Cant</th>
                                    <th></th>
                                </tr>
                                {item.topping ?
                                    item.topping.map((top, index) => {

                                        return (
                                            <tr style={{ fontSize: '14px', color: 'green' }} key={index}>
                                                <td colSpan={'2'}></td>
                                                <td>{top.nombre}</td>
                                                <td>{top.cantidad}</td>
                                                <th></th>
                                            </tr>
                                        )
                                    })
                                    :
                                    ''
                                }
                            </thead>
                        )
                    })}
                </table>
            </div>
        </div>
    )
}

export default ShoppingCart