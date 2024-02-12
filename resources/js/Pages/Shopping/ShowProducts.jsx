import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const ShowProducts = (params) => {

    const [filterProductos, setFilterProductos] = useState([])

    useEffect(() => {
        seleccionarProductos()
    }, [])

    function seleccionarProductos() {
        const temp = params.productos.filter((art) => art.category_id === params.categorias[0].id);
        setFilterProductos(temp)
    }

    function cambiarCategoria(item, index) {
        setBordeDiv(index)
        const temp = params.productos.filter((art) => art.category_id === item.id);
        setFilterProductos(temp)
    }

    function setBordeDiv(index) {
        var div_min = document.getElementById("div_miniaturas");
        for (var x = 0; x < div_min.childNodes.length; x++) {
            if (div_min.childNodes[x].nodeType == Node.ELEMENT_NODE) {
                div_min.childNodes[x].style.border = "";
            }
        }
        document.getElementById('divMin' + index).style.border = "outset";
    }

    function seleccionarProducto(img, item) {
        Swal.fire({
            title: item.nombre,
            imageUrl: img,
            imageHeight: 200,
            imageAlt: '',
            denyButtonColor: 'green',
            confirmButtonColor: 'blue',
            showDenyButton: true,
            confirmButtonText: 'Adicionar toppings',
            denyButtonText: `Agregar al carrito`,
            showCloseButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('inputShowProductAddTopping').value = item.id
                document.getElementById('inputShowProductAddTopping').click()
                document.getElementById('inputGoToppings').click()
            } else if (result.isDenied) {
                document.getElementById('inputShowProductAddToCar').value = item.id
                document.getElementById('inputShowProductAddToCar').click()
                document.getElementById('inputGoToCarrito').click()
            }
        })
    }

    return (
        <div className="row align-items-start">
            <input type='hidden' id='inputShowProductAddToCar' onClick={params.addToCar}></input>
            <input type='hidden' id='inputGoToCarrito' onClick={() => params.setWindowDisplay('2')}></input>
            <input type='hidden' id='inputShowProductAddTopping' onClick={params.addTopping}></input>
            <input type='hidden' id='inputGoToppings' onClick={() => params.setWindowDisplay('4')}></input>
            <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Selecciona los productos:</h1>
            <div id="div_miniaturas" className="row col-lg-2 col-md-2 col-sm-3 col-3" style={{ textAlign: 'center' }} >
                <h1 style={{ marginTop: '0.4em', fontWeight: 'bold' }}>Categorias:</h1>
                {params.categorias.map((item, index) => {
                    return (
                        <div key={index} id={'divMin' + index} onClick={() => cambiarCategoria(item, index)} className="col-lg-2 col-md-2 col-sm-3 col-3" style={{ width: '7em', marginTop: '2em', cursor: 'pointer', marginLeft: '0.5em' }}>
                            <img className="img-fluid img-thumbnail centerImg" style={{ height: 'auto', width: '60%', marginTop: '0.5em' }} src={params.globalVars.urlImagenesCategorias + item.imagen} />
                            <h5 className="card-title">{item.nombre}</h5>
                        </div>
                    )
                })}
            </div>
            <div style={{ marginTop: '0.2em' }} className="col-lg-10 col-md-10 col-sm-9 col-9" >
                <div style={{ textAlign: 'center', marginBottom: '0em' }} className="container">
                    <div className="row justify-content-center" >
                        {
                            filterProductos.map((item, index) => {
                                let img = params.globalVars.myUrl + 'Images/Config/noPreview.jpg'
                                if (item.imagen != '') {
                                    img = params.globalVars.urlImagenes + item.imagen
                                }
                                return (
                                    <div onClick={() => seleccionarProducto(img, item)} key={index} style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                        <div className="card border card-flyer pointer">
                                            <img style={{ width: window.screen.width > 600 ? '60%' : '100%', height: 'auto', marginTop: '1em', padding: '1em' }} src={img} className="card-img-top centerImg rounded" alt="" />
                                            <div style={{ textAlign: 'center' }} className="card-body">
                                                <h2 style={{ fontWeight: 'bold' }} className="card-title">{item.nombre}</h2>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowProducts