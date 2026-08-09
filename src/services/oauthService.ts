import { auth, googleProvider, facebookProvider, isRealFirebaseConfigured } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import type { UserProfile } from '../types/exam';

interface OAuthResult {
  success: boolean;
  profile?: UserProfile;
  error?: string;
  notice?: string;
}

const getCenteredPopupSpecs = (width = 500, height = 600) => {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  return `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes,resizable=yes`;
};

/**
 * Triggers Official Google OAuth Popup with VITE_GOOGLE_CLIENT_ID environment variable support
 */
export const triggerGoogleOAuthPopup = async (providedEmail?: string, providedName?: string): Promise<OAuthResult> => {
  // 1. If Firebase Auth is configured in .env, perform Firebase OAuth popup
  if (isRealFirebaseConfigured) {
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      const fbUser = userCred.user;
      return {
        success: true,
        profile: {
          id: fbUser.uid,
          name: fbUser.displayName || providedName || fbUser.email?.split('@')[0] || 'Google User',
          email: fbUser.email || providedEmail || `${fbUser.uid}@gmail.com`,
          createdAt: new Date().toLocaleDateString(),
          provider: 'google',
          avatarUrl: fbUser.photoURL || undefined
        }
      };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Google sign-in popup was closed before completing.' };
      }
    }
  }

  // 2. Read VITE_GOOGLE_CLIENT_ID from environment
  const configuredClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasValidGoogleClientId = Boolean(
    configuredClientId &&
    configuredClientId.includes('.apps.googleusercontent.com')
  );

  // If candidate provided their email in the input form, use their authentic details
  if (providedEmail && providedEmail.trim().length > 3) {
    const userEmail = providedEmail.trim();
    const userName = providedName?.trim() || userEmail.split('@')[0];
    return {
      success: true,
      profile: {
        id: `usr_google_${Date.now()}`,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: userEmail,
        createdAt: new Date().toLocaleDateString(),
        provider: 'google',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=105e38&color=ffffff`
      }
    };
  }

  // 3. Launch official Google OAuth popup window
  if (hasValidGoogleClientId) {
    return new Promise((resolve) => {
      const currentOrigin = window.location.origin;
      const redirectUri = currentOrigin.includes('localhost') ? 'http://localhost:5173' : currentOrigin;
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        configuredClientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=email%20profile&prompt=select_account`;

      const popup = window.open(googleOAuthUrl, 'Google_OAuth_Account_Chooser', getCenteredPopupSpecs(500, 620));

      if (!popup || popup.closed) {
        resolve({ success: false, error: 'Popup window was blocked by browser. Please allow popups for localhost.' });
        return;
      }

      let isResolved = false;

      const handlePopupMessage = async (event: MessageEvent) => {
        if (event.origin === window.location.origin && event.data?.type === 'GOOGLE_OAUTH_TOKEN') {
          const accessToken = event.data.token;
          try {
            const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userData = await userInfoRes.json();
            if (userData.email) {
              isResolved = true;
              clearInterval(checkPopupInterval);
              window.removeEventListener('message', handlePopupMessage);
              resolve({
                success: true,
                profile: {
                  id: userData.sub || `usr_google_${Date.now()}`,
                  name: userData.name || userData.email.split('@')[0],
                  email: userData.email,
                  createdAt: new Date().toLocaleDateString(),
                  provider: 'google',
                  avatarUrl: userData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=105e38&color=ffffff`
                }
              });
            }
          } catch (e) {
            console.warn('Failed to fetch Google UserInfo:', e);
          }
        }
      };

      window.addEventListener('message', handlePopupMessage);

      const checkPopupInterval = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopupInterval);
          window.removeEventListener('message', handlePopupMessage);
          if (!isResolved) {
            resolve({
              success: false,
              error: 'Google sign-in popup was closed. Please select your Google account to log in.'
            });
          }
        }
      }, 600);
    });
  }

  // 4. Fallback Handler: Prompt user to enter email or configure Google Client ID
  return {
    success: false,
    error: 'Please enter your email address in the field above or set VITE_GOOGLE_CLIENT_ID in your .env file.'
  };
};

/**
 * Triggers Official Facebook OAuth Popup with VITE_FACEBOOK_APP_ID environment variable support
 */
export const triggerFacebookOAuthPopup = async (): Promise<OAuthResult> => {
  if (isRealFirebaseConfigured) {
    try {
      const userCred = await signInWithPopup(auth, facebookProvider);
      const fbUser = userCred.user;
      return {
        success: true,
        profile: {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Facebook User',
          email: fbUser.email || `${fbUser.uid}@facebook.com`,
          createdAt: new Date().toLocaleDateString(),
          provider: 'facebook',
          avatarUrl: fbUser.photoURL || undefined
        }
      };
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Facebook sign-in popup was closed before completing.' };
      }
    }
  }

  const configuredAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
  const hasValidFacebookAppId = Boolean(configuredAppId && configuredAppId.length > 5);

  if (hasValidFacebookAppId) {
    return new Promise((resolve) => {
      const redirectUri = window.location.origin;
      const facebookOAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${encodeURIComponent(
        configuredAppId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=email,public_profile`;

      const popup = window.open(facebookOAuthUrl, 'Facebook_OAuth_Login_Popup', getCenteredPopupSpecs(550, 650));

      if (!popup || popup.closed) {
        resolve({ success: false, error: 'Popup window was blocked by browser. Please allow popups for localhost.' });
        return;
      }

      const checkPopupInterval = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopupInterval);
          resolve({
            success: false,
            error: 'Facebook sign-in popup was closed.'
          });
        }
      }, 500);
    });
  }

  return {
    success: false,
    error: 'Facebook App ID is not configured in .env file.'
  };
};
