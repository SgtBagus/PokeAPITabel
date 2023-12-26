import React from "react";

import Image from "../../../../../Components/Image";
import Video from "../../../../../Components/Video";

import { checkFileUrlName, checkfileUrl } from "../../../../../Helper/checkFile";

import './styles.scss';

const GalleryComponents = ({
    data,
}) => {
    const groupItmes = (items) => items.reduce((acc, x, i) => {
        const splitNumber = Math.round(data.length / 2);

        const idx = Math.floor(i / splitNumber);
        acc[idx] = [...(acc[idx] || []), x];

        return acc;
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="image-gallery">
                        {
                            data.length > 0 ? (
                                <>
                                    {
                                        groupItmes(data).map((data, idx) => {
                                            const columnKey = `column-${idx}`;
                                            
                                            return (
                                                <div className="column" key={columnKey}>
                                                    {
                                                        <>
                                                            {
                                                                data.map((x, i) => {
                                                                    const itemColumnKey = `${columnKey}-item-${i}`;

                                                                    return (
                                                                        <div className="image-item" key={itemColumnKey}>
                                                                            {
                                                                                checkfileUrl(x) ? (
                                                                                    <a href={x} target="_blank" rel="noreferrer">
                                                                                        <Image
                                                                                            src={x}
                                                                                            alt={`messages-gallery-${idx}`}
                                                                                        />
                                                                                        <div className="overlay-gallery">
                                                                                            <span>
                                                                                                {
                                                                                                    checkFileUrlName(x).split('%2F').pop()
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </a>
                                                                                )
                                                                                : (
                                                                                    <Video src={x} />
                                                                                )
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            )
                            : (
                                <div className="container h-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                        <i className="fas fa-image fa-5" style={{ fontSize: '150px'}} />
                                        <h4 className='my-2 text-center'>
                                            Belum ada Gallery yang bisa di tunjukan !
                                        </h4>
                                    </div>
                                </div>
                            )
                        }
                </div>
            </div>
        </div>
    );
};

export default GalleryComponents;
