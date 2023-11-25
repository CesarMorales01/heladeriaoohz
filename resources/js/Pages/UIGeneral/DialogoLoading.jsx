import React from 'react'
import '../../../css/general.css'

const DialogoLoading = (params) => {
    return (
        <>
            <button id='btnModalLoading' type="button" style={{ display: 'none' }} data-toggle="modal" data-target="#modalLoading">
            </button>

            <div id='modalLoading' className="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog-centered" role="document">
                    <div style={{ backgroundColor: '#FFFFFF10' }} className="modal-content">
                        <img
                            style={{ width: '6%', height: 'auto' }}
                            className='centerImg'
                            src={params.url + 'Images/Config/loading.gif'}
                            alt=''
                        >
                        </img>
                        <div style={{ display: 'none' }} className="modal-footer">
                            <button id='btnCloseModalLoading' type="button" className="btn btn-secondary" data-dismiss="modal"></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DialogoLoading