import axios from "axios";
// import { AuthService } from "../service/AuthService";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/'
});

const UNAUTHORIZED = 401;

// axiosInstance.interceptors.request.use((config) => {
//   // If url is not public (REQUIRES AUTHENTICATION),
//   // We're appending authorization header
//   if (
//     !/\/auth\/login/.test(config.url) &&
//     !/\/auth\/refresh/.test(config.url)
    
//   ) {
//     config.headers["Authorization"] = `Bearer ${AuthService.getToken('access')}`;
//   }
//   return config;
// });
// // auth/users/me/
// axiosInstance.interceptors.response.use(
//   async (response) => {
//     // We're going to intercept the successful login response.
//     // First we're going to save the token
//     // Then we're going to issue a request to fetch user details
//     if (/^\/auth\/login/.test(response.config.url)) {
//       // Save the token
//       AuthService.saveToken(response.data);
//       // Issue the request to get own details
//       const usersData = await axiosInstance.get("/auth/users/me/",
//       {
//         headers: {
//           Authorization: `Bearer ${AuthService.getToken("access")}`,
//         },
//       });
//       return usersData;
//     }

//     // If this is a response to the `/auth/me` request,
//     // we're going to save logged in data to the session storage
//     if (/\/auth\/users\/me/.test(response.config.url)) {
//       // Save user data to the session storage.
//       AuthService.saveCurrentUserData(response.data);
//       console.log(response.data);
//     }

//     return response;
//   },
//   async (err) => {
//     // console.log("Handling an API error");
//     const originalConfig = err.config;
//     // console.log(originalConfig);
//     // Make sure this error was not protected
//     if (!originalConfig.url.startsWith("/auth") && err.response) {
//       // console.log("Definately an api error");
//       // Case when access token expired
//       if (err.response.status === UNAUTHORIZED && !originalConfig._retry) {
//         originalConfig._retry = true;
//         try {
//           const rs = await axiosInstance.post(
//             "auth/login/refresh/",
//             {refresh:AuthService.getToken("refresh")},
//             {
//               headers: {
//                 Authorization: `Bearer ${AuthService.getToken("refresh")}`,
//               },
//             }
//           );
//           const token = rs.data;
//           AuthService.saveToken(token);
//           return axiosInstance(originalConfig);
//         } catch (err) {
//           return Promise.reject(err);
//         }
//       }
//     }
//   }
// );

export default axiosInstance;