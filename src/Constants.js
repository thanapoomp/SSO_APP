export const APP_INFO = {
  name: 'Siamsmile',
  version: '0.1',
  since: '2021',
  description: 'Siam smile',
  contactUrl: 'https://devauth.siamsmile.co.th/api'

}

export const API_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "https://devauth.siamsmile.co.th/api" //dev
    : // ?  "http://localhost:54821/api" //dev
    "https://devauth.siamsmile.co.th/api"; // Production


export const ROLES = {
  user: 'user',
  Manager: 'Manager',
  admin: "Admin",
  developer: "Developer",
};
