import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DialogoNewTopping = (params) => {
    const glob = new GlobalFunctions()
    const [topping, setTopping] = useState({
        id: '',
        categoria: '',
        nombre: '',
        descripcion: '',
        imagen: '',
        valor: ''
    })

    useEffect(() => {
        if (params.topping.id != topping.id) {
            setTopping(params.topping)
        }
    })

    function mostrarAlertDatosFaltantes() {
        Swal.fire({
            title: 'Faltan datos importantes!',
            icon: 'warning',
            timer: 1000
        })
    }

    function cambioCate(cate) {
        setTopping((valores) => ({
            ...valores,
            categoria: cate.target.value,
        }))
    }

    function cambioNombre(cate) {
        setTopping((valores) => ({
            ...valores,
            nombre: cate.target.value,
        }))
    }

    function cambioValor(cate) {
        setTopping((valores) => ({
            ...valores,
            valor: cate.target.value,
        }))
    }

    function cambioDescripcion(cate) {
        setTopping((valores) => ({
            ...valores,
            descripcion: cate.target.value,
        }))
    }

    function mostrarImagen(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('ingresarImg');
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
        setTopping((valores) => ({
            ...valores,
            imagen: event.target.files[0].name
        }))
    }

    function loadingOn() {
        document.getElementById('btnIngresar').style.display = 'none'
        document.getElementById('btnLoading').style.display = 'inline'
    }

    function validarCampos(e) {
        e.preventDefault()
        if (topping.nombre != '' && topping.valor!='') {
            if (topping.id == '') {
                document.getElementById('formCrear').submit()
            } else {
                updateTopping()
            }
            loadingOn()
        } else {
            mostrarAlertDatosFaltantes()
        }
    }

    function updateTopping() {
        const form = document.getElementById("formCrear")
        form.action = route('topping.actualizar', topping.id)
        form.submit()
    }


    function abrirDialogoEliminar(top) {
        Swal.fire({
            title: '¿Eliminar '+top.nombre+' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('btnEliminar').click()
                loadingOn()
            }
        })
    }

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoNuevoTopping' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em' }} className="modal-title">{params.topping.id == '' ? 'Crear topping' : 'Editar topping'}</h1>
                        <button onClick={()=>abrirDialogoEliminar(params.topping)} id='btnDialogoEliminar' style={{ marginTop: '0.5em', display: params.topping.id == '' ? 'none' : '', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                        <a id='btnEliminar' style={{ display: 'none' }} href={route('topping.show', params.topping.id)}></a>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <form method="POST" id="formCrear" onSubmit={validarCampos} action={route('topping.store')} encType="multipart/form-data">
                            <input type="hidden" name='_token' value={params.token} />
                            <input type="hidden" name='id' value={params.topping.id == '' ? '' : params.topping.id} />
                            <input type="hidden" name='nombreImagenAnterior' value={params.topping.id == '' ? '' : params.topping.imagen} />
                            <input name='nombre' onChange={cambioNombre} className='form-control rounded' type="text" placeholder='Nombre topping' value={topping.nombre == '' ? '' : topping.nombre} />
                            <br />
                            Categoria:
                            <select onChange={cambioCate} name='categoria' className="form-select rounded" >
                                {params.categorias.map((item, index) => {
                                    return (
                                        <option selected={params.topping.categoria === item.nombre} key={index} value={item.id} >{item.nombre}</option>
                                    )
                                })}
                            </select>
                            <br />
                            Descripción
                            <br />
                            <textarea className='form-control rounded' name='descripcion' rows="2" onChange={cambioDescripcion} placeholder="Descripcion" value={topping.descripcion == '' ? '' : topping.descripcion}></textarea>
                            <br />
                            Valor
                            <br />
                            <input name='valor' onChange={cambioValor} className='form-control rounded' type="text" placeholder='Valor' value={topping.valor == '' ? '' : topping.valor} />
                            <br />
                            <div style={{ padding: '0.4em', marginTop: '0.8em' }} className='row border'>
                                <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                    <input name='imagen' data-toggle="tooltip" title="" type="file" id="fileImg" onChange={mostrarImagen} />
                                </div>
                                <div style={{ marginTop: '0.2em' }} className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                    <img id="ingresarImg" width="140px" height="150px" src={params.topping.imagen == '' ? params.globalVars.myUrl + 'Images/Config/noPreview.jpg' : params.globalVars.urlImagenesCategorias + topping.imagen} />
                                </div>
                                <br />
                            </div>
                            <div className="modal-footer">
                                <SecondaryButton type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                                <PrimaryButton type='submit' id="btnIngresar" style={{ display: 'inline' }} className="btn btn-success">{params.topping.id == '' ? 'Crear topping' : 'Editar topping'}</PrimaryButton>
                                <PrimaryButton id='btnLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
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

export default DialogoNewTopping