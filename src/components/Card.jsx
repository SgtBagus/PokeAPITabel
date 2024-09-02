import React from "react";
import PropTypes from "prop-types";

import Button from "./Button";

const Card = ({
    children, title, type, style, img, onClick, buttonDisabled
}) => {
  return (
    <div className={`card ${type}`} style={style}>
      <img alt="gambar product" className="card-img-top" src={img} style={{ height: '250px', width: 'auto', objectFit: 'contain' }} />
      <div
        className="card-body p-2 d-flex flex-column justify-content-between"
      >
        <h5 className="card-title font-weight-bold">{title}</h5>
        <div className="card-text my-2" style={{ height: '150px', overflow: 'auto' }}>
          {children}
        </div>

        <Button
          label="Add to Cart !"
          buttonIcon="fa fa-cart-plus"
          className="btn btn-primary btn-sm"
          type="button"
          disabled={buttonDisabled}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  type: PropTypes.string,
  height: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.shape(),
};

Card.defaultProps = {
  children: null,
  title: null,
  type: "",
  height: null,
  icon: null,
  style: null,
};

export default Card;
