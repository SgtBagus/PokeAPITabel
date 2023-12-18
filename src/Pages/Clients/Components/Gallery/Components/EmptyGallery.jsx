import React from 'react'

const EmptyGallery = () => {
    return (
        <div className="container h-100">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                <i className="fas fa-image fa-5" style={{ fontSize: '150px'}} />
                <h4 className='my-2 text-center'>
                    Belum ada Gallery yang bisa di tunjukan !
                </h4>
            </div>
        </div>
    )
}

export default EmptyGallery;
