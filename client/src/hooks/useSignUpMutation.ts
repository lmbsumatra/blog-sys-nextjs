'use client';
import { SignUpFormResponse, SignUpFormSchema } from "../types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const signupUser = async (userData: SignUpFormSchema): Promise<SignUpFormResponse> => {
  const response = await axios.post(
    `http://localhost:3001/api/auth/signup`,
    userData
  );
  return response.data;
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data: SignUpFormResponse) => {
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data?.message || "Signup Failed!");
      } else {
        alert("An unexpected error occurred during signup.");
      }
    },
  });
};
