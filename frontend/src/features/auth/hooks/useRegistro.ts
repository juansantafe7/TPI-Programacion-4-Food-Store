import { useMutation } from "@tanstack/react-query"
import { registrar } from "../api/auth"

export const useRegistro = () => useMutation({ mutationFn: registrar })
