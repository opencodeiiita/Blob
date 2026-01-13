module.exports = ({ config }) => {
  const isDevBuild =
    process.env.EAS_BUILD_PROFILE === 'development' || process.env.EXPO_PUBLIC_DEV_BUILD === 'true';

  const plugins = ['expo-router'];

  // only include Google Sign-In plugin for dev builds
  if (isDevBuild) {
    plugins.push(['@react-native-google-signin/google-signin']);
  }

  return {
    ...config,
    expo: {
      name: 'blob',
      slug: 'blob',
      version: '1.0.0',
      scheme: 'mobile',
      platforms: ['ios', 'android'],
      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/favicon.png',
      },
      plugins,
      experiments: {
        typedRoutes: true,
        tsconfigPaths: true,
      },
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'automatic',
      splash: {
        image: './assets/adaptive-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          image: './assets/adaptive-icon.png',
          backgroundColor: '#000000'
        }
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.calc.blob',
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
        package: 'com.calc.blob',
      },
      extra: {
        router: {},
        eas: {
          projectId: '77cc3449-ffd5-48db-beaa-8a0dfee141bf',
        },
      },
      owner: 'calc',
    },
  };
};
