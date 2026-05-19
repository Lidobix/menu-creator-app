export default function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app',
            // '@src': './src',
            '@features': './src/features',
            '@config': './src/config',
            '@types': './src/types',
            '@assets': './assets/index.ts',
          },
        },
      ],
    ],
  };
}
