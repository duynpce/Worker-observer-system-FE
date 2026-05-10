import { useMutation } from "@tanstack/react-query"
import { login } from "./authService"
import type { LoginRequest } from "./authType"

export const useLogin = () => { useMutation({
  mutationFn: (request: LoginRequest) => login(request)
}) }