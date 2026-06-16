import axios from "axios";

let accessToken = null;

export const setAccessToken = (token)=>{
    accessToken = token;
}

const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials:true,
})

API.interceptors.request.use((req)=>{
    


   if(accessToken){
    req.headers.Authorization = `Bearer ${accessToken}`;
   }
    return req;
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        accessToken = res.data.accessToken;

        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`;

        return API(originalRequest);

      } catch (err) {
        localStorage.removeItem("wasLoggedIn");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;