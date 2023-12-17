import React from 'react'
import PropTypes from 'prop-types';

const Tabs = ({
    idTabs, idTabsContent, data: {
        title, content,
    },
}) => {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card card-primary card-tabs">
                    <div className="card-header p-0 pt-1">
                        <ul className="nav nav-tabs" id={idTabs} role="tablist">
                            {
                                title.map(({
                                    id, title, active, icon = null,
                                }) => (
                                        <li
                                            className="nav-item"
                                            key={id}
                                        >
                                            <a
                                                className={`nav-link ${active ? 'active' : '' }`}
                                                data-toggle="pill"
                                                href="#custom-tabs-five-normal"
                                                role="tab"
                                                aria-controls="custom-tabs-five-normal"
                                                aria-selected="false"
                                            >
                                                {
                                                    icon && (
                                                        <i className={icon} /> 
                                                    )
                                                }
                                                {title}
                                            </a>
                                        </li>
                                    )  
                                )
                            }
                        </ul>
                    </div>
                    <div className="card-body">
                        <div className="tab-content" id={idTabsContent}>
                            {
                                content.map(({ id, children, active }) => (
                                    <div
                                        className="tab-pane fade show active"
                                        id={id}
                                        role="tabpanel"
                                        aria-labelledby="custom-tabs-five-overlay-tab"
                                    >
                                        <div className="overlay-wrapper">
                                            {children}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Tabs.propTypes = {
    idTabs: PropTypes.string,
    idTabsContent: PropTypes.string,
    data: PropTypes.shape({
        title: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                title: PropTypes.string,
                icon: PropTypes.string,
                active: PropTypes.bool,
            })
        ),
        content: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                children: PropTypes.node,
                active: PropTypes.bool,
            })
        )
    })
};

Tabs.defaultProps = {
    idTabs: 'id-tabs-1',
    idTabsContent: 'id-tabsContent-1',
    data: {
        title: [
            {
                id: 1,
                title: 'test',
                icon: null,
                active: true,
            }
        ],
        content: [
            {
                id: 1,
                children: undefined,
                active: true,
            }
        ]
    }
};

  
export default Tabs;
