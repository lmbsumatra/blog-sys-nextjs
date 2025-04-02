import { logInFormSchema } from '@/lib/validators';
import { create } from 'zustand';
import { z } from 'zod';
import { LogInFormSchema } from '@/lib/types';


interface FormField {
    value: string;
    triggered: boolean;
    hasErrors: boolean;
    error: string[];
}

interface FormState {
    formData: Record<keyof LogInFormSchema, FormField>;
    updateField: (field: keyof LogInFormSchema, value: string) => void;
    validateField: (field: keyof LogInFormSchema) => void;
    resetLogInForm: () => void;
}

const initialState: Record<keyof LogInFormSchema, FormField> = {
    email: { value: "", triggered: false, hasErrors: false, error: [] },
    password: { value: "", triggered: false, hasErrors: false, error: [] },
};

export const useLogInFormStore = create<FormState>((set, get) => ({
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

        const result = logInFormSchema.safeParse(fullData);

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
    },
    resetLogInForm: () => set({ formData: initialState })

}));
