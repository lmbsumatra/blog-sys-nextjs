import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
  id: string;
  label: string;
  error?: FieldError;
  children: ReactNode;
}

export const FormField = ({ id, label, error, children }: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};