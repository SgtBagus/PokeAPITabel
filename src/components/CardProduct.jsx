import React from "react";
import PropTypes from "prop-types";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import Button from "./Button";

const CardProduct = ({ children, title, type, style, img, onClick, data }) => {
  const navigate = useNavigate();

  const confirmDeleteHandel = (data) => {
    const { title } = data;

    Swal.fire({
      title: "You Sure will Delete this Product ?",
      text: title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete this Data !",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await true;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success",
          text: "Berhasil Menghapus data, halaman ini akan di mulai ulang",
          icon: "success",
        });
      }
    });
  };
  
  const handelNavigate = (path) => {
    const { id } = path;
    return navigate(`edit/${id}`);
  }

  return (
    <div className={`card ${type}`} style={style}>
      <img
        alt="gambar product"
        className="card-img-top"
        src={img}
        style={{ height: "250px", width: "auto", objectFit: "contain" }}
      />
      <div className="card-body p-2 d-flex flex-column justify-content-between">
        <h5 className="card-title font-weight-bold">{title}</h5>
        <div
          className="card-text my-2"
          style={{ height: "150px", overflow: "auto" }}
        >
          {children}
        </div>

        <div className="row my-2">
          <div className="col-6">
            <Button
              label="Edit Product"
              buttonIcon="fa fa-edit"
              className="btn btn-warning btn-sm w-100"
              type="button"
              onClick={() => { handelNavigate(data) }}
            />
          </div>
          <div className="col-6">
            <Button
              label="Delete"
              buttonIcon="fa fa-trash"
              className="btn btn-danger btn-sm w-100"
              type="button"
              onClick={() => {
                confirmDeleteHandel(data);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Button
              label="Add to Cart !"
              buttonIcon="fa fa-cart-plus"
              className="btn btn-primary btn-sm w-100"
              type="button"
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

CardProduct.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  type: PropTypes.string,
  height: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.shape(),
};

CardProduct.defaultProps = {
  children: null,
  title: null,
  type: "",
  height: null,
  icon: null,
  style: null,
};

export default CardProduct;
