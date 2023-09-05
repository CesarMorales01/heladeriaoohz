import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react'
import Swal from 'sweetalert2'
import '../../../css/general.css'
import { useState, useEffect } from 'react';
import newLogo from '../../../../public/Images/Config/plus.png'
import toppingsLogo from '../../../../public/Images/Config/toppings.png'
import Progressbar from '../UIGeneral/ProgressBar'
import GlobalFunctions from '../services/GlobalFunctions'
import DialogoNewCateTopping from './DialogoNewCateTopping';

const CateToppings = (params) => {
    const glob = new GlobalFunctions()
    const [cateTopping, setCateTopping] = useState({
        id: '',
        nombre: ''
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
        setCateTopping({
            id: item.id,
            nombre: item.nombre
        })
        document.getElementById('btnDialogoNuevaCateTopping').click()
    }

    function abrirDialogoEliminarCateTopping(item) {
        setCateTopping({
            id: item.id,
            nombre: item.nombre
        })
        Swal.fire({
            title: '¿Eliminar '+item.nombre+' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('btnEliminarCateTopping'+item.id).click()
                loadingOn()
            }
        })
    }

    function goToppings() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "topping/list/nothing"
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
                        <div onClick={() => abrirDialogo({ id: '', nombre: '' })} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div className="card border border-primary card-flyer pointer">
                                <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nueva categoria de toppings</h2>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6" >
                            <div onClick={goToppings} className="card border border-primary card-flyer pointer">
                                <img style={{ width: '4em', height: '4em', marginTop: '1em' }} src={toppingsLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Toppings</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Categorias toppings</h1>
                <table style={{ textAlign: 'center' }} className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Categoria topping</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {params.catetoppings.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        {item.id}
                                    </th>
                                    <td>{item.nombre}</td>
                                    <td>
                                        <button onClick={() => abrirDialogoEliminarCateTopping(item)} id='btnDialogoEliminar' style={{ marginTop: '0.5em', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                        <a id={'btnEliminarCateTopping'+item.id} style={{ display: 'none' }} href={route('catetopping.show', item.id)}></a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <button id='btnDialogoNuevaCateTopping' data-toggle="modal" data-target="#dialogoNuevaCateTopping" style={{ display: 'none' }} ></button>
            <DialogoNewCateTopping token={params.token} catetopping={cateTopping}></DialogoNewCateTopping>
        </AuthenticatedLayout>
    )
}

export default CateToppings