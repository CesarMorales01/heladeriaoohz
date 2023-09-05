import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DialogoNewCateTopping = (params) => {
    const glob = new GlobalFunctions()
    const [cate, setCate] = useState({
        id: '',
        nombre: ''
    })

    function mostrarAlertDatosFaltantes() {
        Swal.fire({
            title: 'Faltan datos importantes!',
            icon: 'warning',
            timer: 1000
        })
    }

    function cambioNombre(cate) {
        setCate((valores) => ({
            ...valores,
            nombre: cate.target.value,
        }))
    }

    function loadingOn() {
        document.getElementById('btnIngresarCateTopping').style.display = 'none'
        document.getElementById('btnLoadingCateTopping').style.display = 'inline'
    }

    function validarCampos(e) {
        e.preventDefault()
        if (cate.nombre!='') {
            document.getElementById('formCrear').submit()
            loadingOn()
        } else {
            mostrarAlertDatosFaltantes()
        }
    }


    function abrirDialogoEliminarCate(top) {
        Swal.fire({
            title: '¿Eliminar '+top.nombre+' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('btnEliminarCateTopping').click()
                loadingOn()
            }
        })
    }

    return (
        <div className="modal" id='dialogoNuevaCateTopping' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em' }} className="modal-title">{params.catetopping.id == '' ? 'Crear topping' : 'Editar topping'}</h1>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <form method="POST" id="formCrear" onSubmit={validarCampos} action={route('catetopping.store')} >
                            <input type="hidden" name='_token' value={params.token} />
                            <input name='nombre' onChange={cambioNombre} className='form-control rounded' type="text" placeholder='Nombre categoria topping' value={cate.nombre == '' ? '' : cate.nombre} />
                            <br />
                            <div className="modal-footer">
                                <SecondaryButton type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                                <PrimaryButton type='submit' id="btnIngresarCateTopping" style={{ display: 'inline' }} className="btn btn-success">{params.catetopping.id == '' ? 'Crear categoria topping' : 'Editar topping'}</PrimaryButton>
                                <PrimaryButton id='btnLoadingCateTopping' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoNewCateTopping