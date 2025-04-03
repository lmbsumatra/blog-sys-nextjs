"use client";

import { ChangeEvent, useState } from "react";
import { useSignUpFormStore } from "../store/useSignUpFormStore";
import { useSignupMutation } from "../hooks/useSignUpMutation";
import { useRouter } from "next/navigation";

const labelMap: Record<string, string> = {
  firstName: "First Name",
  middleName: "Middle Name",
  lastName: "Last Name",
  userName: "Username",
  email: "Email Address",
  password: "Password",
  confirmPassword: "Confirm Password",
};

const SignUp = () => {
  const { formData, updateField, resetSignUpForm } = useSignUpFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const SignUpMutation = useSignupMutation();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      firstName: formData.firstName.value,
      middleName: formData.middleName.value,
      lastName: formData.lastName.value,
      userName: formData.userName.value,
      email: formData.email.value,
      password: formData.password.value,
      confirmPassword: formData.confirmPassword.value,
      role: "user",
    };

    try {
      setIsSubmitting(true);

      SignUpMutation.mutate(userData, {
        onSuccess: () => {
          alert("Signup Successful!");
          resetSignUpForm();
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Signup Failed!");
        },
      });

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto mt-12 p-8 bg-gray-800 text-white shadow-xl rounded-xl space-y-6 font-sans"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {Object.entries(formData).map(([key, field]) => (
        <div key={key} className="flex flex-col space-y-1">
          <label className="capitalize font-medium">
            {" "}
            {labelMap[key] || key}
          </label>
          <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-1">
            {key === "email" && (
              <img
                src="/assets/icons/email.svg"
                alt="Mail Icon"
                className="w-8 h-8 mr-2"
              />
            )}
            {key === "password" && (
              <img
                src="/assets/icons/password.svg"
                alt="Lock Icon"
                className="w-8 h-8 mr-2"
              />
            )}
            {key === "confirmPassword" && (
              <img
                src="/assets/icons/password.svg"
                alt="Confirm Password Icon"
                className="w-8 h-8 mr-2"
              />
            )}
            <input
              name={key}
              value={field.value}
              onChange={handleChange}
              type={
                key.toLowerCase().includes("password") ? "password" : "text"
              }
              placeholder={`Enter your ${(labelMap[key] || key).toLowerCase()}`}
              className="bg-transparent outline-none text-white flex-grow"
            />
          </div>
          {field.hasErrors &&
            field.error.map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
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
          className={`cursor-pointer underline`}
          onClick={() => router.push(`/login`)}
        >
          Login here.
        </a>
      </span>
    </form>
  );
};

export default SignUp;
