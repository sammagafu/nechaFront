/** OAuth client IDs (set via VITE_* at build time). Must match backend GOOGLE_CLIENT_ID / APPLE_CLIENT_ID. */
export const authConfig = {
  googleClientId: (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || '',
  appleClientId: (import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined)?.trim() || '',
}

export const isGoogleSignInEnabled = authConfig.googleClientId.length > 0
export const isAppleSignInEnabled = authConfig.appleClientId.length > 0
