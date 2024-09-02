import React from "react";

import { HeaderPageComponent } from "./components/HeaderPageComponent";

import { ButtonContextProvider } from "../Context/ButtonContext";
import { LoadingContextProvider } from "../Context/LoadingContext";

export const LayoutPokemon = ({ children, pageName }) => (
  <LoadingContextProvider>
    <div className="p-3">
      <ButtonContextProvider>
        <HeaderPageComponent pageName={pageName} />
        <section className="content">
          <div className="container-fluid">{children}</div>
        </section>
      </ButtonContextProvider>
    </div>
  </LoadingContextProvider>
);
