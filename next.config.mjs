const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/uvp' : '',
  assetPrefix: isProd ? '/uvp/' : '',
};
export default nextConfig;
