import React from 'react'
import PropTypes from 'prop-types';

const Tabs = ({
    idTabs, idTabsContent, data: {
        titleHeader, contentBody,
    },
}) => {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card card-primary card-tabs">
                    <div className="card-header p-0 pt-1">
                        <ul className="nav nav-tabs" id={idTabs} role="tablist">
                            {
                                titleHeader.map(({
                                    id, title, active, tabKey, icon = null,
                                }) => (
                                        <li
                                            className="nav-item"
                                            key={id}
                                        >
                                            <a
                                                className={`nav-link ${active ? 'active' : '' }`}
                                                id={`${tabKey}-tab`}
                                                data-toggle="pill"
                                                href={`#${tabKey}-${id}`}
                                                role="tab"
                                                aria-controls={`#${tabKey}-${id}`}
                                                aria-selected={active ? 'true' : 'false'}
                                            >
                                                {
                                                    icon && (
                                                        <i className={`${icon} mr-2`} /> 
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
                    <div className="card-body h-100">
                        <div className="tab-content" id={idTabsContent}>
                            {
                                contentBody.map(({ id, tabKey, children, active }) => (
                                    <div
                                        className={`tab-pane fade ${active ? 'show active' : '' }`}
                                        id={`${tabKey}-${id}`}
                                        role="tabpanel"
                                        aria-labelledby={`${tabKey}-tab`}
                                        key={id}
                                    >
                                        <div className="overlay-wrapper" style={{ height: "50vh" }}>
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
        titleHeader: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                title: PropTypes.string,
                icon: PropTypes.string,
                tabKey: PropTypes.string,
                active: PropTypes.bool,
            })
        ),
        contentBody: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                tabKey: PropTypes.string,
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
        titleHeader: [
            {
                id: 1,
                title: 'test',
                icon: null,
                active: true,
            }
        ],
        contentBody: [
            {
                id: 1,
                children: <div>test</div>,
                active: true,
            }
        ]
    }
};

  
export default Tabs;
