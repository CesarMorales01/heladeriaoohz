import React from 'react'
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton';

const SuperCantModal = (params) => {

    return (
        <div id="cantModal" className="modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 style={{ textAlign: 'center' }} className="modal-title">Ingresar cantidad</h3>
                    </div>
                    <div className="modal-body">
                        <p style={{ fontSize: '0.8em' }}>(Este método no válida inventario)</p>
                        <input onChange={(event)=>params.cambioSuperCant(event)} value={params.superCantidad.cantidad} className="form-control rounded" type='number' ></input>
                    </div>
                    <div className="modal-footer">
                        <SecondaryButton type="button" data-dismiss="modal">Cancelar</SecondaryButton>
                        <PrimaryButton data-dismiss="modal" type="button" onClick={params.cambioCant} className="btn btn-primary">Aceptar</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuperCantModal