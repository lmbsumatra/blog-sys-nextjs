import { create } from 'zustand';

export type FormData = {
  email: string;
  password: string;
};

interface LoginStatus {
  status: 'pending' | 'success' | 'error' | null;
  message: string;
}

interface FormState {
  formData: FormData;
  isSubmitting: boolean;
  loginStatus: LoginStatus;
  setIsSubmitting: (value: boolean) => void;
  setLoginStatus: (status: LoginStatus) => void;
  resetForm: () => void;
}

const initialState = {
  formData: { email: '', password: '' },
  isSubmitting: false,
  loginStatus: { status: null, message: '' },
};

export const useLogInFormStore = create<FormState>((set) => ({
  ...initialState,

  setIsSubmitting: (value) => set({ isSubmitting: value }),

  setLoginStatus: (status) => set({ loginStatus: status }),

  resetForm: () => set(initialState)
}));
