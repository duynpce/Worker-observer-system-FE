import { api } from "../../config/axios/api";
import type { LoginRequest } from "./authType";

export const login = async (request: LoginRequest) => {
  api.post("/login", request, { toastMessageWhenSuccess: "authentication successful" });
};