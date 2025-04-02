
'use client';

import { create } from 'zustand';
import { z } from 'zod';
import { signUpFormSchema } from '@/lib/validators';
import { SignUpFormSchema } from '@/lib/types';


interface FormField {
    value: string;
    triggered: boolean;
    hasErrors: boolean;
    error: string[];
}

interface FormState {
    formData: Record<keyof SignUpFormSchema, FormField>;
    updateField: (field: keyof SignUpFormSchema, value: string) => void;
    validateField: (field: keyof SignUpFormSchema) => void;
    resetSignUpForm: () => void;
}

const initialState: Record<keyof SignUpFormSchema, FormField> = {
    firstName: { value: "", triggered: false, hasErrors: false, error: [] },
    middleName: { value: "", triggered: false, hasErrors: false, error: [] },
    lastName: { value: "", triggered: false, hasErrors: false, error: [] },
    userName: { value: "", triggered: false, hasErrors: false, error: [] },
    email: { value: "", triggered: false, hasErrors: false, error: [] },
    password: { value: "", triggered: false, hasErrors: false, error: [] },
    confirmPassword: { value: "", triggered: false, hasErrors: false, error: [] },
};

export const useSignUpFormStore = create<FormState>((set, get) => ({
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

        const result = signUpFormSchema.safeParse(fullData);

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
    resetSignUpForm: () => set({ formData: initialState })

}));
