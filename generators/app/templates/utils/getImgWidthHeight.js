export default function getImgWidthHeight(aspectsData, aspect) {
  if (aspectsData[aspect]) return aspectsData[aspect];

  const aspectRatios = {
    regular: { height: 3, width: 3.9, },
    headline: { height: 9, width: 15.48, },
    landscape: { height: 9, width: 20.79, },
    square: { height: 1, width: 1, },
    vertical: { height: 20, width: 17, },
    belgrade: { height: 1, width: 3.18, },
  };

  const { width, height: fullHeight, } = aspectsData.full;
  const height = aspect === 'full'
    ? fullHeight
    : width * (aspectRatios[aspect].height / aspectRatios[aspect].width);

  return { width, height, };
}
