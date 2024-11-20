import {
  REACT_APP_ONELOGIN_CLIENT_ID,
  REACT_APP_ONELOGIN_SUBDOMAIN,
  REACT_APP_REDIRECT_URI,
} from "../config";

const AUTH_CONFIG = {
  clientId: REACT_APP_ONELOGIN_CLIENT_ID,
  subdomain: REACT_APP_ONELOGIN_SUBDOMAIN,
  redirectUri: REACT_APP_REDIRECT_URI,
  scope: "openid profile email",
  responseType: "code",
  prompt: "login",
};

export const initiateOneLogin = (): void => {
  try {
    console.log("initiateOneLogin starting");

    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("auth_state", state);

    const params = new URLSearchParams({
      client_id: AUTH_CONFIG.clientId,
      redirect_uri: AUTH_CONFIG.redirectUri,
      response_type: AUTH_CONFIG.responseType,
      scope: AUTH_CONFIG.scope,
      state: state,
      prompt: "login",
    });

    const redirectUrl = `https://${
      AUTH_CONFIG.subdomain
    }.onelogin.com/oidc/2/auth?${params.toString()}`;
    console.log("Redirecting to:", redirectUrl);

    window.location.href = redirectUrl;
  } catch (error) {
    console.error("Error in initiateOneLogin:", error);
  }
};
