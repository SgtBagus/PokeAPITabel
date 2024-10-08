import React from "react";

import { HeaderComponents } from "./components/Header";
import { FooterComponents } from "./components/Footer";

import { HeaderPageComponent } from "./components/HeaderPageComponent";

import { ButtonContextProvider } from "../Context/ButtonContext";
import { LoadingContextProvider } from "../Context/LoadingContext";

export const LayoutDefault = ({ children, pageName }) => (
  <LoadingContextProvider>
    <HeaderComponents />
    <div className="content-wrapper">
      <ButtonContextProvider>
        <HeaderPageComponent pageName={pageName} />
        <section className="content">
          <div className="container">{children}</div>
        </section>
      </ButtonContextProvider>
    </div>
    <FooterComponents />
  </LoadingContextProvider>
);
