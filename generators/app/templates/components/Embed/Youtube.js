import * as React from 'react';
import { useFela, } from 'react-fela';

import VideoWrapper from './VideoWrapper';
import VideoElement from './VideoElement';

const defaultSettings = {
    controls: '1',
    related: '1',
    loop: '0',
    logo: '1',
    mute: false,
    autoplay: false,
    isVertical: false,
    startAt: 0,
    videoImage: null,
    asGif: false,
};

export default function Youtube({ embedType, settings, source, onLoadCallback, }) {

    const { css, theme, } = useFela();

    const {
        controls,
        related,
        loop,
        logo,
        mute,
        autoplay,
        isVertical,
        startAt,
        asGif,
    } = settings || defaultSettings;

    const start = embedType === 'playlist' ? '&start=' : '?start=';

    let optionsString;

    if (asGif === '1') {
        const chr = embedType === 'playlist' ? '&' : '?';
        optionsString = `${chr}controls=0&autoplay=1&loop=1&playlist=${source}&mute=1&wmode=transparent&controls=0&modestbranding=1&rel=0&showinfo=0`;
    }
    else {
        const playlist = embedType !== 'playlist' && loop === '1' ? `&playlist=${source}` : ''; // must add playlist to enable looping
        optionsString = `${start}${startAt}&controls=${controls}&loop=${loop}&modestbranding=${logo}&rel=${related}&autoplay=${autoplay}&enablejsapi=1&mute=${mute}${playlist}`;
    }

    const verticalWrapperStyle = css({
        extend: [
            theme.mq({ until: 's', }, { maxWidth: '57rem', }),
            theme.mq({ from: 's', until: 'xl', }, { maxWidth: '55rem', }),
            theme.mq({ from: 'xl', }, { maxWidth: '47rem', }),
        ],
    })

    const horizontalWrapperStyle = css({
        // extend: [
        //     theme.mq({ until: 's', }, { marginLeft: '-2rem', marginRight: '-2rem', }),
        //     theme.mq({ from: 'l', until: 'xl', }, { margin: '6rem -20rem', }),
        //     theme.mq({ from: 'xl', }, { margin: '6rem -30rem', }),
        // ],
    })


    return (
        <div className={isVertical ? css(verticalWrapperStyle) : horizontalWrapperStyle}>
            <VideoWrapper aspectRatio={isVertical ? '9/16' : '16/9'}>
                {
                    asGif === '1'
                        ? (
                            <div
                                className={css({
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    top: 0,
                                    start: 0,
                                    zIndex: 6,
                                })}
                            />
                        )
                        : null
                }
                <VideoElement
                    id={`yt_embed_${source}`}
                    width="100%"
                    height="100%"
                    src={`//www.youtube.com/embed/${source}${optionsString}`}
                    frameBorder="0"
                    allowFullScreen
                    onLoad={onLoadCallback}
                    data-test="youtube"
                />
            </VideoWrapper>
        </div>
    );
}
