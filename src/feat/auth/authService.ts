import { api } from "../../config/axios/api";
import type { LoginRequest } from "./auth.type";

export const login = async (request: LoginRequest) => {
  await api.post("/login", null, {
    params: {
      username: request.username,
      password: request.password,
    },
    toastMessageWhenSuccess: false,
  });
};