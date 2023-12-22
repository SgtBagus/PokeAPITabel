import React from 'react'
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Modals = ({
    buttonLabel, idModal, typeModal, children, className, disabled,
    btnSubmitText, btnCancelText, btnSubmitHandel, btnCancelHandel,
    buttonIcon, buttonSubmitIcon, btnSubmitDisabled, style, modalLarge,
    headerTitle, btnCancelId,
}) => {
    return (
        <>
            <button
                type="button"
                className={`btn btn-${typeModal} ${className}`}
                data-toggle="modal"
                data-target={`#${idModal}`}
                disabled={disabled}
                style={style}
            >
                {
                    buttonIcon && (
                        <i className={buttonIcon} />
                    )
                }
                {buttonLabel}
            </button>

            {
                createPortal(
                    <div className="modal fade" id={idModal}>
                        <div className={`modal-dialog ${modalLarge && 'modal-lg'}`}>
                            <div className="modal-content">
                                {
                                    headerTitle && (
                                        <div className="modal-header">
                                            <h4 className="modal-title">{headerTitle}</h4>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                    )
                                }
                                <div className="modal-body">
                                    {children}
                                </div>
                                <div className="modal-footer justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={btnCancelHandel}
                                        id={btnCancelId}
                                    >
                                        {btnCancelText}
                                    </button>
                                    {
                                        btnSubmitHandel && (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={btnSubmitHandel}
                                                disabled={btnSubmitDisabled}
                                            >
                                                {
                                                    buttonSubmitIcon && (
                                                        <i className={buttonSubmitIcon} />
                                                    )
                                                }
                                                {btnSubmitText}
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>,
                    
                    document.getElementById('modals')
                )
            }
        </>
    )
}


Modals.propTypes = {
    buttonLabel: PropTypes.string,
    idModal: PropTypes.string,
    typeModal: PropTypes.string,
    children: PropTypes.node,
    headerTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    btnSubmitText: PropTypes.string,
    btnCancelText: PropTypes.string,
    btnSubmitHandel: PropTypes.func,
    btnCancelHandel: PropTypes.func,
    buttonIcon: PropTypes.string,
    className: PropTypes.string,
    buttonSubmitIcon: PropTypes.string,
    btnCancelId: PropTypes.string,
    btnSubmitDisabled: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.shape(),
    modalLarge: PropTypes.bool,
};

Modals.defaultProps = {    
    buttonLabel: 'Default Modal',
    idModal: 'defaultModal',
    typeModal: 'default',
    children: 'One fine body...',
    headerTitle: null,
    btnSubmitText: 'Save changes',
    btnCancelText: 'Cancel',
    btnCancelId: 'btn-cancel',
    btnSubmitHandel: null,
    btnCancelHandel: () => {},
    buttonIcon: null,
    className: '',
    buttonSubmitIcon: null,
    btnSubmitDisabled: false,
    disabled: false,
    style: {},
    modalLarge: false,
};

export default Modals;
