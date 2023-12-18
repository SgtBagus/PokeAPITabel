import React from 'react'

const EmptyTodo = () => {
    return (
        <div className="container h-100">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                <i className="fa fa-tasks fa-5" style={{ fontSize: '150px'}} />
                <h4 className='my-2 text-center'>
                    Belum ada Todo yang di berikan
                </h4>
            </div>
        </div>
    )
}

export default EmptyTodo;
