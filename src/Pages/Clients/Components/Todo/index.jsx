import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../../../../firebase";

import EmptyTodo from "./Components/EmptyTodo";
import Widgets from "../../../../Components/Widgets";
import Loading from "../../../../Components/Loading";
import Button from "../../../../Components/Button";

import { ChatContext } from "../../../../Context/ChatContext";

import { catchError } from '../../../../Helper/helper';
import fireBaseTime from '../../../../Helper/fireBaseTime';

import { FORM_TYPES } from "../../../../Enum/Form";

const Todo = () => {
    const [dataTask, setDataTask] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: { user: { userInfo: { uid } }} } = useContext(ChatContext);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
      
        if (uid) {
          const unSub = onSnapshot(doc(db, "toDoLists", uid), (doc) => {
            if (doc.exists()) {
                const getData = Object.entries(doc.data()) || [];
                const res = getData.map(x => x[1]);
                const sortingList = res.sort(({ createdDate: pCreatedDate}, { createdDate }) => (
                    new Date(pCreatedDate.seconds * 1000 + pCreatedDate.nanoseconds/1000000) - new Date(createdDate.seconds * 1000 + createdDate.nanoseconds/1000000)
                ));
                
                setDataTask(sortingList);
            } else {
                setDataTask([]);
            }

            setIsLoading(false);
          }, (error) => {
            NotificationManager.error(catchError(error), 'Terjadi Kesalahan', 5000);
          });
    
          return () => { unSub() };
        }
    }, [uid]);

    return (
        <div className="row">
            <div className="col-md-12" style={{ height: "450px" }}>
                {
                    isLoading ? (
                        <div className="overlay position-relative" style={{ height: "400px" }}>
                            <Loading />
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-md-12 my-2">
                                <Button
                                    className="btn btn-block btn-primary"
                                    label="Tambah To Do Client"
                                    onClick={() => {
                                        return navigate(`to-do/${FORM_TYPES.CREATE}`);
                                    }}
                                    buttonIcon="fa fa-plus"
                                />
                            </div>
                            <div className="col-md-12" style={{ height: "395px", overflow: 'auto' }}>
                                {
                                    dataTask.length > 0 ? (
                                        <div className="row">
                                            {
                                                dataTask.map((data) => {
                                                    const { title, id, note, createdDate, statusFinish, updatedDate, progressNote } = data;

                                                    return (
                                                        <div className="col-md-6" key={id}>
                                                            <Widgets
                                                                borderClass="border-primary"
                                                                icon="fa fa-tasks"
                                                                title={title}
                                                                subTitle={note}
                                                                descWidgets={progressNote}
                                                                ribbonStyle={statusFinish ? { title: 'Ribbon', bgStyle: 'bg-success' } : null}
                                                                buttonStyle={{
                                                                    label: "Lihat Lebih Lengkap",
                                                                    className: "btn-primary w-100 my-2 rounded",
                                                                    buttonIcon: "fa fa-eye",
                                                                    onHandel: () => {
                                                                        return navigate(`to-do/${FORM_TYPES.EDIT}/${uid}/${id}`);
                                                                    },
                                                                }}
                                                            >
                                                                <span className="d-flex text-align-center">
                                                                    <i className="fa fa-calendar mr-2" /> Dibuat Pada: {fireBaseTime(createdDate).toDateString().toString("MMMM yyyy")}
                                                                </span>
                                                                <span className="d-flex text-align-center">
                                                                    <i className="fa fa-calendar mr-2" /> Diupdate Pada: {fireBaseTime(updatedDate).toDateString().toString("MMMM yyyy")}
                                                                </span>
                                                            </Widgets>
                                                        </div>
                                                    )}
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <EmptyTodo />
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Todo;
