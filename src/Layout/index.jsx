import React from "react";

// import { HeaderComponents } from './Components/Header';
// import { SidebarComponents } from './Components/Sidebar';
// import { FooterComponents } from './Components/Footer';

import { HeaderPageComponent } from "./Components/HeaderPageComponent";

import { ButtonContextProvider } from "../Context/ButtonContext";
import { LoadingContextProvider } from "../Context/LoadingContext";

export const LayoutDefault = ({ children, pageName }) => (
  <LoadingContextProvider>
    <>
      <div className="p-3">
        <ButtonContextProvider>
          <HeaderPageComponent pageName={pageName} />
          <section className="content">
            <div className="container-fluid">{children}</div>
          </section>
        </ButtonContextProvider>
      </div>
    </>
  </LoadingContextProvider>
);
