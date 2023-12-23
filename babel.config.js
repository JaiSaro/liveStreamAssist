module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    },
  },
};
