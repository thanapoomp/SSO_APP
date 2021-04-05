export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    config => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
        config.headers["Access-Control-Allow-Origin"] = "*";
        // config.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE";
        // config.headers["Access-Control-Allow-Headers"] = "X-Requested-With,content-type";
        // config.headers["Access-Control-Allow-Credentials"] = true;
      }

      return config;
    },
    err => {
      Promise.reject(err)
    }
  );
}
