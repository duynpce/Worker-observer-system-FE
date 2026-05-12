import { api } from "../../config/axios/api";
import type { LoginRequest } from "./auth.type";

export const login = async (request: LoginRequest) => {
  api.post("/login", request, { toastMessageWhenSuccess: "authentication successful" });
};