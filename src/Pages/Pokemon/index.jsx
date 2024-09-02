import React, { useState, useContext, useEffect } from "react";
import { NotificationManager } from "react-notifications";

import { LoadingContext } from "../../Context/LoadingContext";
import { ButtonContext } from "../../Context/ButtonContext";

import Tabel from "../../Components/Tabel";
import Loading from "../../Components/Loading";

import { TABEL_META } from "./config";
import { catchError } from "../../Helper/helper";

const PokemonTabel = () => {
  const [curretPage, setCurrentPage] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=5&offset=0"
  );
  const [nextPage, setNextPage] = useState({ previous: null, next: null });
  const [dataMeta, setDataMeta] = useState({
    tabelHead: TABEL_META,
    coloumnData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const { dispatchLoading } = useContext(LoadingContext);
  const { dispatch } = useContext(ButtonContext);

  const { previous, next } = nextPage;
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      try {
        let columnData = [];

        await fetch(curretPage)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            const { results, next, previous } = data;

            columnData = results.map(({ name, url }) => {
              const pokemonIndex = url.split("/")[url.split("/").length - 2];
              return { id: pokemonIndex, no: pokemonIndex, name };
            });

            setNextPage({ previous, next });
          });

        setDataMeta({
          tabelHead: TABEL_META,
          coloumnData: columnData,
        });
      } catch (err) {
        NotificationManager.error(catchError(err), "Terjadi Kesalahan", 5000);
      }

      setIsLoading(false);
      dispatchLoading(false);
    };

    getData();

    dispatch({
      typeSwtich: "CHANGE_BUTTON",
      dataButtonList: [
        {
          id: 1,
          type: "button",
          className: "btn btn-default",
          onClick: () => {
            setCurrentPage(previous);
          },
          buttonText: "Previous Page",
          disabled: previous === null,
          iconButton: "fa fa-arrow-left",
        },
        {
          id: 2,
          type: "button",
          className: "btn btn-default",
          onClick: () => {
            setCurrentPage(next);
          },
          buttonText: "Next Page",
          disabled: next === null,
          iconButton: "fa fa-arrow-right",
        },
      ],
    });
  }, [curretPage, dispatch, dispatchLoading, next, previous]);

  return (
    <div className="row">
      <div className="col-12">
        {isLoading ? (
          <div className="container h-100">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <Loading title="Memuat..." />
            </div>
          </div>
        ) : (
          <Tabel dataMeta={dataMeta} />
        )}
      </div>
    </div>
  );
};

export default PokemonTabel;
