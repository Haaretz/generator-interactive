import React from 'react';
import { useFela, } from 'react-fela';

export default function VideoWrapper({ aspectRatio, children = null, }) {

    const { css, } = useFela();
    const [width, height,] = aspectRatio ? aspectRatio.split('/') : [16, 9,];
    const aspect = `${Number(height / width) * 100}%`;

    const figureStyles = css({
        margin: '0',
        paddingBottom: aspect,
        height: '0',
        overflow: 'hidden',
        position: 'relative',
    })

    return (
        <figure className={figureStyles}>
            {children}
        </figure>
    );
}