type LoginUserResponseDto = {
  token: {
    idToken: string;
  };
  user: {};
};

export type TokenData = LoginUserResponseDto["token"];
export type UserAuthData = LoginUserResponseDto["user"];

const SESSION_NAME = "user-session";
const USER_AUTH_NAME = "user-auth";

export const setUserSessionData = async (data: TokenData) => {
  localStorage.setItem(SESSION_NAME, JSON.stringify(data));
};

export const setUserAuthData = async (data: UserAuthData) => {
  localStorage.setItem(USER_AUTH_NAME, JSON.stringify(data));
};

export const getUserSessionData = (): TokenData | undefined => {
  const config = localStorage.getItem(SESSION_NAME);
  if (config) {
    return JSON.parse(config) as TokenData;
  }
};

export const getUserAuthData = (): UserAuthData | undefined => {
  const config = localStorage.getItem(USER_AUTH_NAME);
  if (config) {
    return JSON.parse(config) as UserAuthData;
  }
};

export const isAuthenticated = (): boolean => {
  const userSession = getUserSessionData();
  const userAuth = getUserAuthData();
  return Boolean(userSession) && Boolean(userAuth);
};

export const clearUserSession = () => {
  localStorage.removeItem(SESSION_NAME);
  localStorage.removeItem(USER_AUTH_NAME);
};
