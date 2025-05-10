import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LogInFormSchema } from "../types/form/loginSchema";
import { LoginRes } from "../types/res-dto/loginRes";
import { ErrorRes } from "../types/res-dto/errorRes.ts";

const loginUser = async (creds: LogInFormSchema): Promise<LoginRes> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/login`,
    creds,
    { withCredentials: true }
  );
  return response.data;
};

export const useLogInMutation = () => {
  return useMutation<LoginRes, AxiosError<ErrorRes>, LogInFormSchema>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login success:", data);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "An unexpected login error occurred.";
      alert(message);
    },
  });
};
