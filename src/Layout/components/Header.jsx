import React from "react";

import InputText from '../../Components/form/InputText';


export const HeaderComponents = () => {
  return (
    <div className="main-header navbar navbar-expand-md navbar-light navbar-white">
      <div className="container">
        
        <button className="navbar-toggler order-1" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse order-3" id="navbarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="/" className="nav-link">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/pokemon" className="nav-link">
                Pokemon
              </a>
            </li>
          </ul>
          <form className="form-inline ml-0 ml-md-3">
            <div className="input-group input-group-sm">
              <InputText
                  placeholder="Search"
                  name="search"
                  value=""
                  changeEvent={(val, e) => this._changeInputHandler('codeReveal', val, e)}
              />
              <div className="input-group-append">
                <button className="btn btn-navbar" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
          <li className="nav-item">
            <div
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fa fa-shopping-cart"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
