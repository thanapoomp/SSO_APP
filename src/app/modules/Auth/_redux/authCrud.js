import axios from "axios";
import * as CONST from "./../../../../Constants";
import jwt_decode from "jwt-decode";
import {encodeURLWithParams} from '../../Common/components/ParamsEncode';

var dayjs = require("dayjs");
// http://uat.siamsmile.co.th:9185/api/SSO/login
export const LOGIN_URL = `${CONST.API_URL}/Auth/login`;
export const REGISTER_URL = `${CONST.API_URL}/Auth/user/register`;
export const REQUEST_PASSWORD_URL = `api/auth/forgot-password`;
export const RENEW_TOKEN_URL = `${CONST.API_URL}/Auth/renew`
export const CHANGPASSWORD_URL = `${CONST.API_URL}/Auth/user/changepassword`
export const ASSIGN_ROLE_URL = `${CONST.API_URL}/Auth/role/assign`
export const GET_USER_BYID_URL = `${CONST.API_URL}/Auth/role/getuserid`;
export const GET_USER_FILTER_URL = `${CONST.API_URL}/Auth/user/filter`;
export const DISABLE_USER_URL = `${CONST.API_URL}/Auth/user/disable`;
export const ENABLE_USER_URL = `${CONST.API_URL}/Auth/user/enable`;
export const ADD_SOURCE_URL = `${CONST.API_URL}/Auth/source/add`;
export const ADD_ROLES_URL = `${CONST.API_URL}/Auth/role/add`;

export const ME_URL = `${CONST.API_URL}/Auth/renew`;

export function login(username, password, source) {
  return axios.post(LOGIN_URL, { username, password, source });
}

export function register(mapperId, username, password, sourceid) {
  return axios.post(REGISTER_URL, { mapperId, username, password, sourceid });
}

export function changePassword(oldPassword, oldConfirmPassword, newPassword, newConfirmPassword) {
  return axios.post(CHANGPASSWORD_URL, { oldPassword, oldConfirmPassword, newPassword, newConfirmPassword });
}
export function assignRoles(payload) {
  return axios.post(ASSIGN_ROLE_URL, { payload });
}

export function addSource(sourceName) {
  return axios.post(ADD_SOURCE_URL, { sourceName });
}

export function addRoles(roleName) {
  return axios.post(ADD_ROLES_URL, { roleName });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken(token) {
  let decoded = jwt_decode(token)['unique_name'];
  return decoded;
}

export function getUserGuidByToken(token) {
  let decodedGuid = jwt_decode(token)['nameid'];
  return decodedGuid;
}

export function getUserById(id) {
  return axios.get(`${GET_USER_BYID_URL}/${id}`);
}

export function disableUser(id) {
  return axios.put(`${DISABLE_USER_URL}/${id}`);
}

export function enableUser(id) {
  return axios.put(`${ENABLE_USER_URL}/${id}`);
}

export function getExp(token) {
  let decoded = jwt_decode(token);
  return dayjs.unix(decoded.exp);
}

export function renewToken() {
  return axios.post(RENEW_TOKEN_URL)
}

export const getUserFilter = (orderingField, ascendingOrder, page, recordsPerPage, userName, sourceName, mapperId) => {
  let payload = {
    orderingField,
    ascendingOrder,
    page,
    recordsPerPage,
    userName,
    sourceName,
    mapperId
  }

  var r = axios.get(encodeURLWithParams(`${GET_USER_FILTER_URL}`, payload));
  return r;
};

export function getRoles(token) {
  let decoded = jwt_decode(token);
  if (!decoded.role) {
    return []
  }
  return decoded.role;
}
