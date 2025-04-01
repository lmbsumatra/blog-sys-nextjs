import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const signupUser = async (userData: any) => {
  const response = await axios.post(
    "http://localhost:3000/api/users/",
    userData
  );
  return response.data;
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupUser, 
    onSuccess: (data: any) => {
      
    },
    onError: (error: any) => {
      console.error("Error signing up", error);
    },
  });
};