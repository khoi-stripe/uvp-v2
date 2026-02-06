const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/uvp-v2' : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: isProd ? '/uvp-v2/' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
export default nextConfig;
