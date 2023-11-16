import React from 'react'

const Video = ({
    className, src, style,
}) => {
    return (
        <video
            className={className}
            style={style}
            controls
        >
            <source src={src} type="video/mp4" />
            Your browser does not support HTML video.
        </video>
    )
}

export default Video;
