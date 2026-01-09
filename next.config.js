/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable SWC transforms
    swcPlugins: [],
  },
  // Optimize webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Add bundle analyzer in development
    if (dev && process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: false,
        })
      );
    }

    // Optimize split chunks
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'vendor-react',
            chunks: 'all',
            priority: 10,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'vendor-three',
            chunks: 'all',
            priority: 10,
          },
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'vendor-lucide',
            chunks: 'all',
            priority: 10,
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'vendor-framer',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  },
  // Optimize images
  images: {
    unoptimized: true, // Disable optimization for export mode
    formats: ['image/webp', 'image/avif'],
  },
  // Enable compression
  compress: true,
};

export default nextConfig;