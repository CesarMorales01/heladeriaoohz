import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import '../../css/general.css'
import logoProducts from '../../../public/Images/Config/products.jpg'
import logoRegistradora from '../../../public/Images/Config/registradora.jpg'
import Progressbar from './UIGeneral/ProgressBar'
import React, { useState, useEffect } from 'react'

export default function Dashboard(params) {
    const [progressBar, setProgressBar] = useState(false)

    function goProducts() {
        window.location = params.globalVars.myUrl + "product"
        setProgressBar(true)
    }


    function goVentas() {
        window.location = params.globalVars.myUrl + "shopping"
        setProgressBar(true)
    }

    function imprimir(){
        window.print();
    }


    return (
        <AuthenticatedLayout
            user={params.auth}
        >
            <Head title="Heladeria Oohz" />
            <div className="py-2">
                <div style={{ display: progressBar ? '' : 'none' }}>
                    <Progressbar progress={progressBar}></Progressbar>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div style={{ textAlign: 'center', marginBottom: '1em' }} className="container">
                        <div className="row justify-content-center" >
                            <div className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goProducts} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '12em', height: '10em', marginTop: '1em' }} src={logoProducts} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Productos</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goVentas} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '10em', height: '10em', marginTop: '1em' }} src={logoRegistradora} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Ventas</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goVentas} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '10em', height: '10em', marginTop: '1em' }} src={logoRegistradora} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Ventas</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input style={{ display: 'none' }} type="button" value="Imprimir" onClick={imprimir} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
