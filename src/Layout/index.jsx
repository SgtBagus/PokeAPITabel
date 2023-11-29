import React from 'react';

import { HeaderComponents } from './components/Header';
import { SidebarComponents } from './components/Sidebar';
import { FooterComponents } from './components/Footer';

import { HeaderPageComponent } from './components/HeaderPageComponent';

import { ButtonContextProvider } from "../context/ButtonContext";

export const LayoutDefault = ({ dataLogin, children, pageName, path }) => (
    <>
        {
            dataLogin && (
                <>
                    <HeaderComponents />
                        <SidebarComponents dataLogin={dataLogin} path={path} />
                        <div className="content-wrapper">
                            <ButtonContextProvider>
                                <HeaderPageComponent pageName={pageName} />
                                <section className="content">
                                    <div className="container-fluid">{children}</div>
                                </section>
                            </ButtonContextProvider>
                        </div>
                    <FooterComponents />
                </>
            )
        }
    </>
);