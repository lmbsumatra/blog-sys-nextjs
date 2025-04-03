"use client";

import { ChangeEvent, useState } from "react";
import { useLogInFormStore } from "../store/useLogInFormStore";
import { useLogInMutation } from "../hooks/useLogInMutation";
import useAuthStore from "../store/useAuthStore";
import { useRouter } from "next/navigation";

const LogIn = () => {
  const { formData, updateField } = useLogInFormStore();
  const LogInMutation = useLogInMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    LogInMutation.mutate(
      { email: formData.email.value, password: formData.password.value },
      {
        onSuccess: (data) => {
          alert("Login Successful!");
          setAuth(data.token);
          router.push("/login");
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Login Failed!");
        },
      }
    );

    setIsSubmitting(false);
  };

  return (
    <form
      className="max-w-md mx-auto mt-16 p-8 bg-gray-800 text-white shadow-xl rounded-xl space-y-6 font-sans"
      onSubmit={handleSubmit}
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
            name="email"
            value={formData.email.value}
            onChange={handleChange}
            placeholder="Enter your email"
            className="bg-transparent outline-none text-white flex-grow"
          />
        </div>
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
            name="password"
            value={formData.password.value}
            onChange={handleChange}
            type="password"
            placeholder="Enter your password"
            className="bg-transparent outline-none text-white flex-grow"
          />
        </div>
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
          className={`cursor-pointer underline`}
          onClick={() => router.push(`/sign-up`)}
        >
          Login here.
        </a>
      </span>
    </form>
  );
};

export default LogIn;
