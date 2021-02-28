import React from 'react';
import { useFela, } from 'react-fela';

export default function VideoElement({ as, classPrefix, ...props }, ref) {

    const { css, } = useFela();

    const iframeStyles = css({
        margin: '0',
        padding: '0',
        height: '100% !important',
        width: '100% !important',
        left: '0',
        top: '0',
        position: 'absolute',
        display: 'block',
        border: 'none',
    })


    return (
        <iframe className={iframeStyles} {...props}></iframe>
    );
}