import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  Login: "[Login] Action",
  Register: "[Register] Action",
  Logout: "[Logout] Action",
  RenewToken: "[Renew Token] Action",
  EditId: "[Edit] Action",
};

const initialAuthState = {
  user: null,
  authToken: null,
  exp: null,
  roles: [],

  edit: {
    id: 0,
  }
};

export const reducer = persistReducer(
  { storage, key: "auth", whitelist: ["user", "authToken", "exp", "roles"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        return {
          ...state,
          user: action.payload.user,
          authToken: action.payload.authToken,
          exp: action.payload.exp,
          roles: [...action.payload.roles],
        };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: null };
      }

      case actionTypes.Logout: {
        return {
          ...state,
          user: null,
          authToken: null,
          exp: null,
          roles: [],
        };
      }

      case actionTypes.RenewToken: {
        return {
          ...state,
          user: action.payload.user,
          authToken: action.payload.authToken,
          exp: action.payload.exp,
          roles: [...action.payload.roles],
        };
      }

      case actionTypes.EditId: {
        return {
          ...state,
          edit: action.payload,
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (payload) => ({ type: actionTypes.Login, payload }),
  register: (payload) => ({ type: actionTypes.Register, payload }),
  logout: () => ({ type: actionTypes.Logout }),
  renewToken: (payload) => ({ type: actionTypes.RenewToken, payload }),
  edit: (payload) => ({ type: actionTypes.EditId, payload }),
};
