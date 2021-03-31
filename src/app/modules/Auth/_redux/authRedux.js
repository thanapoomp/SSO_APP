import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  Login: "[Login] Action",
  Register: "[Register] Action",
  Logout: "[Logout] Action",
  RenewToken: "[Renew Token] Action",
  EditId: "[Edit] Action",
  SaveRole: "[SaveRole] Action",
  EditRole: "[Edit Role] Action",
  EditSource: "[Edit Source] Action",
};

const initialAuthState = {
  user: null,
  authToken: null,
  exp: null,
  roles: [],


  userGuid: 0,
  employeeCode: 0,
  roleId: [],

  editRoleId: 0,
  editRoleName:"",

  editSourceId: 0,
  editSourceName: "",


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
        debugger
        return {
          ...state,
          userGuid: action.payload.userGuid,
          employeeCode: action.payload.employeeCode,

        };
      }

      case actionTypes.EditRole: {
        debugger
        return {
          ...state,
          editRoleId: action.payload.roleId,
          editRoleName: action.payload.roleName,

        };
      }

      case actionTypes.EditSource: {
        debugger
        return {
          ...state,
          editSourceId: action.payload.sourceId,
          editSourceName: action.payload.sourceName,

        };
      }

      case actionTypes.SaveRole: {
        debugger
        return {
          ...state,
          roleId: [...action.payload],

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

  //get assige role
  edit: (payload) => ({ type: actionTypes.EditId, payload }),
  editRole: (payload) => ({ type: actionTypes.EditRole, payload }),
  editSource: (payload) => ({ type: actionTypes.EditSource, payload }),
  saveRoles: (payload) => ({ type: actionTypes.SaveRole, payload }),
};
