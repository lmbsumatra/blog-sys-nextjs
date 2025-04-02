"use client";

import { ChangeEvent, useState } from "react";
import { useLogInFormStore } from "../store/useLogInFormStore";
import { useLogInMutation } from "../hooks/useLogInMutation";
import useAuthStore from "../store/useAuthStore";

const LogIn = () => {
  const { formData, updateField, resetLogInForm } = useLogInFormStore();
  const LogInMutation = useLogInMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuthStore();
  const token = useAuthStore((state) => state.token);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const creds = {
      email: formData.email.value,
      password: formData.password.value,
    };

    try {
      setIsSubmitting(true);

      LogInMutation.mutate(creds, {
        onSuccess: (data) => {
          alert("Login Successful!");
          // resetLogInForm();
          setAuth(data.token);
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Login Failed!");
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
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LogIn;
