"use client";

import { ChangeEvent, useState } from "react";
import { useSignUpFormStore } from "../store/useSignUpFormStore";
import { useSignupMutation } from "../hooks/useSignUpMutation";

const SignUp = () => {
  const { formData, updateField, resetSignUpForm } = useSignUpFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const SignUpMutation = useSignupMutation();

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
    <form className="space-y-4 p-4" onSubmit={handleSubmit}>
      {Object.entries(formData).map(([key, field]) => (
        <div key={key} className="flex flex-col">
          <label className="capitalize">{key}</label>
          <input
            name={key}
            value={field.value}
            onChange={handleChange}
            className="border p-2"
          />
          {field.hasErrors &&
            field.error.map((err, index) => (
              <p key={index} className="text-red-500">
                {err}
              </p>
            ))}
        </div>
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2"
      >
        {isSubmitting ? "Creating User..." : "Create User"}
      </button>
    </form>
  );
};

export default SignUp;
