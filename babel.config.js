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
            '@src': './app/src',
            '@features': './app/src/features',
            '@assets/*': './assets',
          },
        },
      ],
    ],
  };
}
