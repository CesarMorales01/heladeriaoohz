import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react'
import Swal from 'sweetalert2'
import '../../../css/general.css'
import { useState, useEffect } from 'react';
import newLogo from '../../../../public/Images/Config/plus.png'
import logotop from '../../../../public/Images/Config/catetopping.jpg'
import Progressbar from '../UIGeneral/ProgressBar'
import DialogoNewTopping from './DialogoNewTopping';
import GlobalFunctions from '../services/GlobalFunctions'

const Toppings = (params) => {
    const glob = new GlobalFunctions()
    const [topping, setTopping] = useState({
        id: '',
        categoria: '',
        nombre: '',
        descripcion: '',
        imagen: '',
        valor: ''
    })

    const [progressBar, setProgressBar] = useState(false)

    useEffect(() => {
        
        if (params.estado != '') {
            Swal.fire({
                title: params.estado,
                icon: params.estado.includes('elimin') ? 'warning' : 'success',
                timer: !params.duracionAlert ? 1000 : params.duracionAlert
            })
        }
    }, [])


    function abrirDialogo(item) {
        setTopping({
            id: item.id,
            categoria: item.categoria,
            nombre: item.nombre,
            descripcion: item.descripcion,
            imagen: item.imagen,
            valor: item.valor
        })
        document.getElementById('btnDialogoNewTopping').click()
    }

    function goCateToppings() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "catetopping/list/nothing"
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars} urlImagenes={params.globalVars.urlImagenes}>
            <Head title="Toppings" />
            <div style={{ display: progressBar ? '' : 'none' }}>
                <Progressbar progress={progressBar}></Progressbar>
            </div>
            <div className='container table-responsive'>
                <div align="center" className="row justify-content-center">
                    <div style={{ marginTop: '0.8em' }} className="row">
                        <div onClick={() => abrirDialogo({ id: '', nombre: '', imagen: '' })} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div className="card border border-primary card-flyer pointer">
                                <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nuevo topping</h2>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6" >
                            <div onClick={goCateToppings} className="card border border-primary card-flyer pointer">
                                <img style={{ width: '4em', height: '4em', marginTop: '1em' }} src={logotop} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em', fontSize: '17px', color: 'black', fontWeight: 'bold' }} className="card-title">Categorias toppings</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Lista de toppings</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Topping</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Imagen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {params.toppings.map((item, index) => {

                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        {item.id}
                                        <br />
                                        <a onClick={() => abrirDialogo(item)} className='border' style={{ cursor: 'pointer' }} >
                                            <svg style={{ padding: '0.2em', backgroundColor: '#127b38' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </a>
                                    </th>
                                    <td>{item.nombre}</td>
                                    <td>{item.categoria}</td>
                                    <td>$ {glob.formatNumber(item.valor)}</td>
                                    <td>
                                        <img className='img-fluid rounded' style={{ width: '6em', heigth: '6em' }} src={item.imagen=='' ? params.globalVars.myUrl+'Images/Config/noPreview.jpg' : params.globalVars.urlImagenesCategorias + item.imagen} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <button id='btnDialogoNewTopping' data-toggle="modal" data-target="#dialogoNuevoTopping" style={{ display: 'none' }} ></button>
            <DialogoNewTopping categorias={params.categorias} token={params.token} globalVars={params.globalVars} topping={topping} ></DialogoNewTopping>            
        </AuthenticatedLayout>
    )
}

export default Toppings