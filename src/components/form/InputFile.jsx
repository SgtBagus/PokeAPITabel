import React from "react";
import PropTypes from "prop-types";

import Image from "../Image";
import Video from "../Video";

import { checkFileUrlName, checkThisFileIsImageOrNot, checkfileUrl } from "../../Helper/checkFile";

import { DEFAULT_IMAGE } from "../../Enum/DefaultValue";

const srcImageRender = (value) => {
    try {
        const valueSrcRender = URL.createObjectURL(value);

        return ({ valueSrcRender, isNew: true });
    } catch {
        return ({ valueSrcRender: value, isNew: false });
    }
}

const renderFile = (
    isNew,
    value,
    rawFile = null,
    style,
) => {
    const isFileIsImage = isNew ? checkThisFileIsImageOrNot(rawFile) : checkfileUrl(value);

    return isFileIsImage ? (
        <Image
            src={value}
            className="rounded w-100"
            style={style}
            alt="Preview Image"
        />
    ) : (
        <Video
            src={value}
            className="rounded w-100"
            style={style}
            alt="Preview Image"
        />
    )
}

const renderPlaceHolder = (isNew, value, placeHolder) => {
    let newPlaceHolder = placeHolder

    if (!isNew && value) {
        newPlaceHolder = checkFileUrlName(value).split('%2F').pop();
    } else if (isNew && value) {
        const { name } = value;

        newPlaceHolder = name;
    }

    return newPlaceHolder;
}

const InputFile = ({
    value, changeEvent, placeHolder, style,
}) => {
    const { valueSrcRender, isNew } = srcImageRender(value);

    return (
        <div className="input-group">
            {
                value ? (
                    renderFile(isNew, valueSrcRender, value, style)
                ) : (
                    <Image
                        src={DEFAULT_IMAGE}
                        className="rounded w-100"
                        style={style}
                        alt="Preview Image"
                    />
                )
            }
            <div className="custom-file mt-2">
                <input
                    type="file"
                    className="custom-file-input"
                    id="exampleInputFile"
                    onChange={(e) => {
                        try {
                            changeEvent(e.target.files[0])
                        } catch {
                            changeEvent(null)
                        }
                    }}
                />
                <label className="custom-file-label" htmlFor="exampleInputFile">
                    {renderPlaceHolder(isNew, value, placeHolder)}
                </label>
            </div>
        </div>
    );
};

InputFile.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape(),
    ]),
    placeHolder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]),
    changeEvent: PropTypes.func.isRequired,
    style: PropTypes.shape({}),
};

InputFile.defaultProps = {
    value: null,
    placeHolder: 'Pilih File',
    style: { objectFit: "cover", height: '200px' },
};

export default InputFile;
