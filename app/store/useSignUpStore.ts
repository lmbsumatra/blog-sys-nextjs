import { create } from "zustand";
import { z } from "zod";

const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters long" });

const baseSignupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  userName: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
});

const signupSchema = baseSignupSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface FormField {
  value: string;
  triggered: boolean;
  hasErrors: boolean;
  error: string[];
}

interface FormData {
  firstName: FormField;
  middleName: FormField;
  lastName: FormField;
  userName: FormField;
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
}

interface SignUpStore {
  formData: FormData;
  setField: (field: keyof FormData, value: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

const extractFormValues = (formData: FormData) => {
  const values: Record<string, string> = {};
  for (const key in formData) {
    values[key] = formData[key as keyof FormData].value;
  }
  return values;
};

type ZodFormattedError = {
  _errors: string[];
  [key: string]: ZodFormattedError | string[];
};

const useSignupStore = create<SignUpStore>((set, get) => ({
  formData: {
    firstName: { value: "", triggered: false, hasErrors: false, error: [] },
    middleName: { value: "", triggered: false, hasErrors: false, error: [] },
    lastName: { value: "", triggered: false, hasErrors: false, error: [] },
    userName: { value: "", triggered: false, hasErrors: false, error: [] },
    email: { value: "", triggered: false, hasErrors: false, error: [] },
    password: { value: "", triggered: false, hasErrors: false, error: [] },
    confirmPassword: { value: "", triggered: false, hasErrors: false, error: [] },
  },

  setField: (field, value) =>
    set((state) => {
      const updatedFormData = { ...state.formData };
      updatedFormData[field] = {
        ...updatedFormData[field],
        value,
        triggered: true,
      };
  
      try {
        const fieldSchema = z.object({ [field]: baseSignupSchema.shape[field] });
        fieldSchema.parse({ [field]: value });
        updatedFormData[field].hasErrors = false;
        updatedFormData[field].error = [];
      } catch (e) {
        if (e instanceof z.ZodError) {
          const formattedErrors = e.format() as ZodFormattedError;
          updatedFormData[field].hasErrors = true;
          updatedFormData[field].error =
            formattedErrors[field]?._errors || ["Invalid input"];
        }
      }
  
      return { formData: updatedFormData };
    }),
  

  validateForm: () => {
    let isValid = true;
    const currentState = get();
    const formValues = extractFormValues(currentState.formData);

    const updatedFormData = { ...currentState.formData };
    
    for (const field in updatedFormData) {
      updatedFormData[field as keyof FormData].triggered = true;
    }

    try {
      signupSchema.parse(formValues);
      
      for (const field in updatedFormData) {
        updatedFormData[field as keyof FormData].hasErrors = false;
        updatedFormData[field as keyof FormData].error = [];
      }
    } catch (e: unknown) {
      isValid = false;
      
      if (e instanceof z.ZodError) {
        const formattedErrors = e.format() as z.ZodFormattedError<{ [k: string]: string }>;
        
        for (const field in updatedFormData) {
          const typedField = field as keyof FormData;
          const fieldErrors = formattedErrors[field];
          
          if (fieldErrors && typeof fieldErrors === 'object' && '_errors' in fieldErrors) {
            updatedFormData[typedField].hasErrors = true;
            updatedFormData[typedField].error = fieldErrors._errors;
          }
        }
      }
    }

    set({ formData: updatedFormData });
    return isValid;
  },

  resetForm: () =>
    set({
      formData: {
        firstName: { value: "", triggered: false, hasErrors: false, error: [] },
        middleName: { value: "", triggered: false, hasErrors: false, error: [] },
        lastName: { value: "", triggered: false, hasErrors: false, error: [] },
        userName: { value: "", triggered: false, hasErrors: false, error: [] },
        email: { value: "", triggered: false, hasErrors: false, error: [] },
        password: { value: "", triggered: false, hasErrors: false, error: [] },
        confirmPassword: { value: "", triggered: false, hasErrors: false, error: [] },
      },
    }),
}));

export default useSignupStore;