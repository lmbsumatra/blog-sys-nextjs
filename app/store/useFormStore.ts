import { create } from 'zustand';
import { z } from 'zod';

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    userName: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

export type FormSchema = z.infer<typeof formSchema>;

interface FormField {
    value: string;
    triggered: boolean;
    hasErrors: boolean;
    error: string[];
}

interface FormState {
    formData: Record<keyof FormSchema, FormField>;
    updateField: (field: keyof FormSchema, value: string) => void;
    validateField: (field: keyof FormSchema) => void;
}

const initialState: Record<keyof FormSchema, FormField> = {
    firstName: { value: "", triggered: false, hasErrors: false, error: [] },
    middleName: { value: "", triggered: false, hasErrors: false, error: [] },
    lastName: { value: "", triggered: false, hasErrors: false, error: [] },
    userName: { value: "", triggered: false, hasErrors: false, error: [] },
    email: { value: "", triggered: false, hasErrors: false, error: [] },
    password: { value: "", triggered: false, hasErrors: false, error: [] },
    confirmPassword: { value: "", triggered: false, hasErrors: false, error: [] },
};

export const useFormStore = create<FormState>((set, get) => ({
    formData: initialState,
    updateField: (field, value) => {
        set((state) => ({
            formData: {
                ...state.formData,
                [field]: { ...state.formData[field], value, triggered: true }
            }
        }));
        get().validateField(field);
    },
    validateField: (field) => {
        const { formData } = get();

        const fullData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, value.value])
        );

        const result = formSchema.safeParse(fullData);

        if (!result.success) {
            const fieldErrors = result.error.errors
                .filter(err => err.path[0] === field)
                .map(err => err.message);

            set((state) => ({
                formData: {
                    ...state.formData,
                    [field]: {
                        ...state.formData[field],
                        hasErrors: fieldErrors.length > 0,
                        error: fieldErrors
                    }
                }
            }));
        } else {
            set((state) => ({
                formData: {
                    ...state.formData,
                    [field]: {
                        ...state.formData[field],
                        hasErrors: false,
                        error: []
                    }
                }
            }));
        }
    }

}));
