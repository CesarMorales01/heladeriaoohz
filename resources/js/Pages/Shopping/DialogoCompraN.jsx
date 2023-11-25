import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton'

const DialogoCompraN = (params) => {
    const glob = new GlobalFunctions()
    const [lista, setLista] = useState([])
    const [compran, setCompran] = useState(0)
    const [idCompra, setIdCompra] = useState(0)

    useEffect(() => {
        if (Object.keys(params.datos).length > 0) {
            if (params.datos.id != idCompra) {
                const array = []
                setIdCompra(params.datos.id)
                setLista(array)
                setCompran(params.datos.compra_n)
            }
        }
    })

    useEffect(() => {
        fetchProductos()
    }, [idCompra])

    function fetchProductos() {
        const enlace = params.url + 'shopping/shoppingproducts/' + idCompra
        fetch(enlace).then((response) => {
            return response.json()
        }).then((json) => {
            setLista(json)
        })
    }

    function totalItem(item) {
        let total = parseInt(item.precio * item.cantidad)
            let subtop = 0
            item.tops.forEach(element => {
                let subT = parseInt(element.valor * element.cantidad)
                subtop=subtop+subT
            })
            total = total + (subtop * item.cantidad)
        return total
    }

    return (
        <div className="modal fade" id='dialogoCompraN' tabIndex="-1" >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{compran == 0 ? '' : 'Lista productos compra N°: ' + params.datos.compra_n + '. ' + params.datos.cliente.nombre}</h5>
                    </div>
                    <div className="modal-body">
                        <div style={{ marginTop: '0.2em' }} className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th colSpan='2'>Producto</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Cant</th>
                                        <th scope="col">Subtotal</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                {lista.map((item, index) => {
                                    return (
                                        <thead key={index}>
                                            <tr className='align-middle'  >
                                                <td colSpan='2'>{item.producto}</td>
                                                <td>${glob.formatNumber(item.precio)}</td>
                                                <td>
                                                    {item.cantidad}
                                                </td>
                                                <td>${glob.formatNumber(parseInt(item.precio) * parseInt(item.cantidad))}</td>
                                                <td></td>
                                            </tr>
                                            <tr style={{ display: item.tops.length > 0 ? '' : 'none', fontSize: '14px', color: 'green' }}>
                                                <th colSpan='2'></th>
                                                <th scope="col">Topping</th>
                                                <th scope="col">Cant</th>
                                                <th></th>
                                            </tr>
                                            {item.tops ?
                                                item.tops.map((top, index) => {
                                                    return (
                                                        <tr style={{ fontSize: '14px', color: 'green' }} key={index}>
                                                            <th colSpan='2'></th>
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
                    <div className="modal-footer">
                        <PrimaryButton type="button" data-dismiss="modal">Close</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoCompraN