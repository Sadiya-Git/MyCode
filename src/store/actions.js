// action - account reducer
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const ACCOUNT_INITIALIZE = 'ACCOUNT_INITIALIZE';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const SET_DOMAIN_CERTIFICATES = 'SET_DOMAIN_CERTIFICATES'

// action - customization reducer
export const SET_MENU = '@customization/SET_MENU';
export const MENU_OPEN = '@customization/MENU_OPEN';
export const SET_FONT_FAMILY = '@customization/SET_FONT_FAMILY';
export const SET_BORDER_RADIUS = '@customization/SET_BORDER_RADIUS';
export const setUserProfile = (profileData) => ({
    type: SET_USER_PROFILE,
    payload: profileData,
  });