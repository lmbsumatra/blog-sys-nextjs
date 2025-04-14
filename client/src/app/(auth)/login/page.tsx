"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLogInFormStore } from "@/src/store/useLogInFormStore";
import { useLogInMutation } from "@/src/hooks/useLogInMutation";
import useAuthStore from "@/src/store/useAuthStore";
import { logInFormSchema } from "@/src/lib/validations/auth";

const LogIn = () => {
  const { formData, isSubmitting, setIsSubmitting } = useLogInFormStore();
  const LogInMutation = useLogInMutation();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(logInFormSchema),
    mode: "all",
    defaultValues: formData,
  });

  const handleSubmitForm = async (data: {
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);

    LogInMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (data) => {
          alert("Login Successful!");
          setAuth(data.token);
          window.location.href = `/`;
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Login Failed!");
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <form
      className="max-w-md mx-auto mt-16 p-8 bg-gray-800 text-white shadow-xl rounded-xl space-y-6 font-sans"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

      <div className="flex flex-col space-y-2">
        <label className="capitalize font-medium">Email</label>
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-1">
          <img
            src="/assets/icons/email.svg"
            alt="Mail Icon"
            className="w-8 h-8 mr-2"
          />
          <input
            {...register("email")}
            placeholder="Enter your email"
            className="bg-transparent outline-none text-white flex-grow"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="capitalize font-medium">Password</label>
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-1">
          <img
            src="/assets/icons/password.svg"
            alt="Lock Icon"
            className="w-8 h-8 mr-2 p-0"
          />
          <input
            {...register("password")}
            type="password"
            placeholder="Enter your password"
            className="bg-transparent outline-none text-white flex-grow"
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 rounded-lg text-white font-bold transition-colors ${
          isSubmitting
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <span>
        Don't have an account?{" "}
        <a
          className="cursor-pointer underline"
          onClick={() => router.push(`/sign-up`)}
        >
          Signup here.
        </a>
      </span>
    </form>
  );
};

export default LogIn;
