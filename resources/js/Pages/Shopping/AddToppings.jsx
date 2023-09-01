import React from 'react'
import { useState, useEffect } from 'react'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'

const AddToppings = (params) => {
  const [productToTopping, setProductToTopping] = useState(params.productToTopping)
  const glob = new GlobalFunctions()
  const [superCantTop, setSuperCantTop] = useState({
    item: {},
    cant: 0
  })

  useEffect(() => {
    if (productToTopping.length != params.productToTopping) {
      setProductToTopping(params.productToTopping)
    }
  })

  function openDialogoSuperCantTopping(item) {
    Swal.fire({
      title: 'Ingresar cantidad',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Agregar',
      reverseButtons: true,
      preConfirm: (cant) => {
        setSuperCantTop((valores) => ({
          ...valores,
          item: item,
          cant: cant
        }))
        setTimeout(() => {
          document.getElementById('inputFromToppingSuperCant').click()
        }, 100);
      }
    })
  }

  function agregarAlCarrito() {
    document.getElementById('inputGoToCarFromToppings').click()
  }

  function goBackFromToopings() {
    document.getElementById('inputRegresarFromToppings').click()
  }

  return (
    <div>
      <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Agregar toppings a {productToTopping ? productToTopping.nombre : ''}</h1>
      <div style={{ textAlign: 'center', margin: '0.5em' }} className="container">
        <div style={{ marginBottom: '1em' }}>
          <input type='hidden' id='inputRegresarFromToppings' onClick={() => params.setWindowDisplay('1')}></input>
          <input type='hidden' id='inputGoToCarFromToppings' onClick={() => params.setWindowDisplay('2')}></input>
          <input type='hidden' id='inputFromToppingSuperCant' onClick={() => params.setSuperCantTopping(superCantTop)}></input>
          <button onClick={goBackFromToopings} style={{ textTransform: 'uppercase', margin: '0.4em' }} className='btn btn-primary btn-sm'>Seleccionar productos</button>
          <button onClick={agregarAlCarrito} style={{ marginLeft: '1em', textTransform: 'uppercase', margin: '0.4em', backgroundColor: '#0ea6ab' }} className='btn btn-primary btn-sm'>Resumen carrito</button>
        </div>
        <div className="row justify-content-center" >
          {params.adiciones.map((item, index) => {

            let img = params.globalVars.myUrl + 'Images/Config/noPreview.jpg'
            if (item.imagen != '') {
              img = params.globalVars.urlImagenesCategorias + item.imagen
            }

            let cant = 0
            params.toppingSelected.forEach(element => {
              if (element.nombre == item.nombre && element.fk_producto == productToTopping.id) {
                cant = element.cantidad
              }
            })

            return (
              <div key={index} style={{ margin: '0.5em', width: '13em', height: '17em' }} className="card border card-flyer pointer col-lg-3 col-md-3 col-sm-3 col-3">
                <img style={{ width: '12em', height: '10em', padding: '0.3em' }} src={img} className="card-img-top img-fluid centerImg" alt="" />
                <h2 style={{ fontWeight: 'bold' }} id={'tituloTopping' + index} className="card-title">{item.nombre}</h2>
                <div className='row justify-content-center'>
                  <div className='col-4'>
                    <button disabled={params.loadingTops=='' ? true : false} onClick={() => params.masCantTopping(item)} className="btn btn-light btn-sm">
                      <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ marginTop: '0.3em' }} className='col-4'>
                    <button disabled={params.loadingTops=='' ? true : false} id={'idCantTopping' + item.id} onClick={() => openDialogoSuperCantTopping(item)} className='btn btn-outline-success bt-sm'>{cant}</button>
                  </div>
                  <div className='col-4'>
                    <button disabled={params.loadingTops=='' ? true : false} onClick={() => params.menosCantTopping(item)} className="btn btn-light btn-sm">
                      <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" className="bi bi-dash-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ margin: '0.2em' }}>
                    Total $ {cant ? glob.formatNumber(parseInt(item.valor) * parseInt(cant)) : 0}
                  </div>
                </div>
              </div>
            )
          })
          }
        </div>
        <div style={{ marginTop: '0.5em', textAlign: 'center', marginBottom: '0.5em' }} className="col-12" >
          <span style={{ display: params.loadingTops }} className="spinner-border text-primary" role="status" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  )
}

export default AddToppings