import React from 'react';

import { HeaderComponents } from './components/Header';
import { SidebarComponents } from './components/Sidebar';
import { FooterComponents } from './components/Footer';

export const LayoutDefault = ({
    dataLogin, children, pageName, path
}) => (
    <>
        {
            dataLogin && (
                <>
                    <HeaderComponents />
                        <SidebarComponents dataLogin={dataLogin} path={path} />
                        <div className="content-wrapper">
                            <div className="content-header">
                                <div className="container-fluid">
                                    <div className="row mb-2">
                                        <div className="col-sm-6">
                                            <h1 className="m-0">{pageName}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <section className="content">
                                <div className="container-fluid">
                                    {children}
                                </div>
                            </section>
                        </div>
                    <FooterComponents />
                </>
            )
        }
    </>
)