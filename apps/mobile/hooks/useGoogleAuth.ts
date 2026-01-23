import Constants from 'expo-constants';

let GoogleSignin: any = null;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.log('can not use google sign-in in expo go');
}

export function isGoogleSignInAvailable(): boolean {
  return GoogleSignin !== null && Constants.appOwnership !== 'expo';
}

export function configureGoogleSignIn() {
  if (!isGoogleSignInAvailable()) {
    console.warn('can not use google sign-in in expo go');
    return;
  }

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });
}

export async function signInWithGoogle() {
  if (!isGoogleSignInAvailable()) {
    console.warn('can not use google sign-in in expo go');
    throw new Error('can not use google sign-in in expo go. please use a dev build.');
  }

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;
    return { idToken, userInfo };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}
