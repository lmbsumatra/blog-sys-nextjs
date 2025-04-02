// 'use client';
import { LogInFormResponse, LogInFormSchema } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


const loginUser = async (creds: LogInFormSchema): Promise<LogInFormResponse> => {
  const response = await axios.post(
    "/api/auth/login",
    creds
  );
  return response.data;
};

export const useLogInMutation = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LogInFormResponse) => {
      console.log("Logged in!", data);
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
