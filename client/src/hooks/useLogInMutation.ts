
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LogInFormResponse, LogInFormSchema } from "../types/types";


const loginUser = async (creds: LogInFormSchema): Promise<LogInFormResponse> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/login`,
    creds,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const useLogInMutation = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LogInFormResponse) => {
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data?.message || "Login Failed!");
      } else {
        alert("An unexpected error occurred during login.");
      }
    },
  });
};
