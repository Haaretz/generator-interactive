const BASE_URL = 'https://img.haarets.co.il/img';
const transformPrefixes = {
  width: 'width=',
  height: 'height=',
};

const userTransformsReducer = (allTransforms, [ propName, value, ]) => {
  const prefix = transformPrefixes[propName];
  if (!prefix) return allTransforms;

  const transfromString = prefix + value;
  return `${allTransforms}&${transfromString}`;
};

export default function buildFastylImgURL({
  contentId,
  imgName,
  cropData,
  settings,
}) {
  const preCrop = `precrop=${cropData.width},${cropData.height},x${
    cropData.x || 0
  },y${cropData.y || 0}`;
  const userTransforms = Object.entries(settings).reduce(userTransformsReducer, '');

  return `${BASE_URL}/${contentId}/${imgName}?${preCrop}${userTransforms}`;
}
