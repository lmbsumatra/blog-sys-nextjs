"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SignUpFormSchema } from "@/src/types/types";
import { useSignupMutation } from "@/src/hooks/useSignUpMutation";
import { signUpFormSchema } from "@/src/lib/validations/auth";

const labelMap: Record<keyof SignUpFormSchema, string> = {
  firstName: "First Name",
  middleName: "Middle Name",
  lastName: "Last Name",
  userName: "Username",
  email: "Email Address",
  password: "Password",
  confirmPassword: "Confirm Password",
};

const SignUp = () => {
  const router = useRouter();
  const signUpMutation = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: "all",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpFormSchema) => {
    signUpMutation.mutate(
      { ...data, role: "user" },
      {
        onSuccess: () => {
          alert("Signup Successful!");
          reset();
          router.push("/login");
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Signup Failed!");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto mt-12 p-8 bg-gray-800 text-white shadow-xl rounded-xl space-y-6 font-sans"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {(Object.keys(labelMap) as (keyof SignUpFormSchema)[]).map((fieldKey) => (
        <div key={fieldKey.toString()} className="flex flex-col space-y-1">
          <label className="capitalize font-medium">{labelMap[fieldKey]}</label>
          <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-1">
            {(fieldKey === "email" ||
              (fieldKey as string).includes("password")) && (
              <img
                src={`/assets/icons/${
                  fieldKey === "email" ? "email" : "password"
                }.svg`}
                alt={`${labelMap[fieldKey]} Icon`}
                className="w-8 h-8 mr-2"
              />
            )}
            <input
              {...register(fieldKey as string)}
              type={
                (fieldKey as string).includes("password") ? "password" : "text"
              }
              placeholder={`Enter your ${labelMap[fieldKey].toLowerCase()}`}
              className="bg-transparent outline-none text-white flex-grow"
            />
          </div>
          {errors[fieldKey] && (
            <p className="text-red-500 text-sm">{errors[fieldKey]?.message}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 rounded-lg text-white font-bold transition-colors ${
          isSubmitting
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isSubmitting ? "Creating User..." : "Create User"}
      </button>

      <span>
        Already have an account?{" "}
        <a
          className="cursor-pointer underline"
          onClick={() => router.push(`/login`)}
        >
          Login here.
        </a>
      </span>
    </form>
  );
};

export default SignUp;
