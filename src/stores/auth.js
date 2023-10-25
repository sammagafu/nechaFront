import { defineStore } from 'pinia';
import { reactive } from 'vue';
import axiosInstance from "@/http";

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    rememberUser : false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem('refreshToken', refreshToken);
    },
    async loginUser(email, password,rememberme) {
      axiosInstance.post('jwt/create',{'email':email,'password' : password})
      .then((response) => {
        if (rememberme){
            this.rememberUser = true;
            this.setToken(response.data.access);
            this.setRefreshToken(response.data.access);
        }else{
          this.setToken(response.data.access);
          this.setRefreshToken(response.data.access);
        }
            
      }).catch((err) => {
        console.log('err :>> ', err);
      });
    },
    async refreshToken() {
      // Make an API request to refresh the JWT token using the refresh token.
      // Update the token and refresh token in state with the new values.
      this.setToken('new_jwt_token_here');
      this.setRefreshToken('new_refresh_token_here');
    },
    logout() {
      this.token = null;
      this.refreshToken = null;
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
});
