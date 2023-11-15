import React from 'react'

const Image = ({
    className, src, alt, style,
}) => {
    return (
        <img
            className={className}
            src={src}
            alt={alt}
            style={style}
        />
    )
}

export default Image;
