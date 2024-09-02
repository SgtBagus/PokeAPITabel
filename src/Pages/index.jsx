import React, { useState, useContext, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";

import { LoadingContext } from "../Context/LoadingContext";
import { ButtonContext } from "../Context/ButtonContext";

import Card from "../Components/CardProduct";
import InputText from "../Components/form/InputText";
import InputSelect from '../Components/form/InputSelect';
import Button from "../Components/Button";

import { catchError } from "../Helper/helper";

const PokemonTabel = () => {
  const navigate = useNavigate();

  const [productsList, setProductList] = useState([]);
  const [filter, setFilter] = useState({
    limit: 10,
    search: '',
    order: 'asd',
    sortBy: 'title',
  })

  const { limit, search, sortBy, order } = filter;
  const [currentAPI, setCurrentAPI] = useState(`https://dummyjson.com/products/search?q=${search}&limit=${limit}&sortBy=${sortBy}&sortBy=${order}`);

  const { dispatchLoading } = useContext(LoadingContext);
  const { dispatch } = useContext(ButtonContext);

  useEffect(() => {
    const getData = async () => {
      try {
        await fetch(currentAPI)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            const { products } = data;

            setProductList(products);
          });
      } catch (err) {
        NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);
      }

      dispatch({
        typeSwtich: "CHANGE_BUTTON",
        dataButtonList: [
          {
            id: 1,
            type: "button",
            className: "btn btn-primary",
            onClick: () => { navigate('create') },
            buttonText: "Create",
            iconButton: "fa fa-plus",
          },
        ],
      });
      dispatchLoading(false);
    };

    getData();
  }, [currentAPI, dispatch, dispatchLoading, navigate]);

  return (
    <>
      <div className="row">
        <div className="col-12 d-flex">
          <InputText
            placeholder="Search...!"
            classes="mx-2"
            name="search"
            value={search}
            changeEvent={(val) => setFilter({ limit, search: val, sortBy, order })}
          />
          <InputSelect
              data={[{ value: 10, option: '10' },{ value: 25, option: '25' },{ value: 50, option: '50' },{ value: 100, option: '100' }]}
              value={limit}
              classes="mx-2"
              changeEvent={(val) => setFilter({ limit: val, search, sortBy, order })}
              placeholder="Pilih Pengguna"
              name="userSelected"
              required
          />
          <InputSelect
              data={[{ value: 'title', option: 'Title' }, { value: 'price', option: 'Price' }]}
              value={sortBy}
              classes="mx-2"
              changeEvent={(val) => setFilter({ limit, search, sortBy: val, order })}
              placeholder="Pilih Pengguna"
              name="userSelected"
              required
          />
          <InputSelect
              data={[{ value: 'asd', option: 'ASD' },{ value: 'desc', option: 'DESC' } ]}
              value={order}
              classes="mx-2"
              changeEvent={(val) => setFilter({ limit, search, sortBy, order: val })}
              placeholder="Pilih Pengguna"
              name="userSelected"
              required
          />
          <Button
            label=""
            buttonIcon="fa fa-search"
            className="btn btn-primary mx-2"
            type="button"
            onClick={() => {
              setCurrentAPI(`https://dummyjson.com/products/search?q=${search}&limit=${limit}&sortBy=${sortBy}&order=${order}`)
            }}
          />
        </div>
      </div>
      <div className="row my-3">
        {productsList.map((data) => {
          const { id, title, description, images, price, stock} = data;
          return (
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 d-flex align-items-stretch">
              <Card
                key={id}
                title={title}
                icon="fa fa-icon"
                img={images[0]}
                type="card-primary"
                data={data}
              >
                {description}
                <br />
                <b>Price: ${price}</b>
                <br />
                <small>Stock: {stock}</small>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PokemonTabel;
