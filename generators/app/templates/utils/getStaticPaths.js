import { PAGES_URL_PARTS, } from '../consts/index';

const paths = [
  ...PAGES_URL_PARTS.map(item => ({ params: { id: item.id, filename: 'index', }, })),
  ...PAGES_URL_PARTS.map(item => ({ params: { id: item.id, filename: 'closed', }, })),
];

export default async function getStaticPaths() {
  return {
    paths,
    fallback: true,
  };
}
