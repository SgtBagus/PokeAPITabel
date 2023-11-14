import React from 'react';

export const NotFound404 = ({ dataLogin, children, pageName, path }) => (
    <div className="error-page">
        <h2 className="headline text-warning"> 404</h2>

        <div className="error-content">
            <h3><i className="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found.</h3>

            <p>
                We could not find the page you were looking for.
            </p>
        </div>
  </div>
)