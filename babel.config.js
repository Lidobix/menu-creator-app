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
            '@features': './src/features',
            '@ingredients': './src/features/ingredients',
            '@pizzaEditor': './src/features/pizzaEditor',
            '@components': './src/components',
            '@config': './src/config',
            '@types': './src/types',
            '@assets': './assets/index.ts',
          },
        },
      ],
    ],
  };
}
