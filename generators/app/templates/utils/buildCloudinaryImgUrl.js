const BASE_URL = 'https://images.haarets.co.il/image';
const POLOPOLY_HREF_BASE = 'https://www.haaretz.co.il';
const transformPrefixes = {
  width: 'w_',
  height: 'h_',
  quality: 'q_',
  x: 'x_',
  y: 'y_',
  gravity: 'g_',
};

export default function buildCloudinaryImgUrl({
  contentId,
  imgName,
  cropData,
  settings,
  version
}) {
  const initialTransforms = `${Object.entries(cropData).reduce(
    (allTransforms, [ propName, value ]) => {
      const prefix = transformPrefixes[propName];
      if (!prefix) return allTransforms;

      const initiralChar = allTransforms ? ',' : '/';
      const transfromString = prefix + value.toString();

      return allTransforms + initiralChar + transfromString;
    },
    ''
  )},c_crop`;

  const userTransforms = `${Object.keys(settings).reduce(
    (allTransforms, propName) => {
      const prefix = transformPrefixes[propName];
      const transfromString = prefix ? prefix + settings[propName] : '';
      return prefix
        ? allTransforms + (allTransforms ? ',' : '/') + transfromString
        : allTransforms;
    },
    ''
  )},c_fill,f_auto,g_auto`;

  // const { transforms, flags, } = settings;

  // Url suffix based on whether this is an uploaded or fetched image
  const urlSuffix = version
    ? `/v${version}/${contentId}.${imgName}`
    : `/${POLOPOLY_HREF_BASE}/polopoly_fs/${contentId}!/image/${imgName}`;
  // construct url string from params
  const url = BASE_URL
    + (version ? '/upload' : '/fetch')
    + initialTransforms
    + userTransforms
    + urlSuffix;
  return url;
}
