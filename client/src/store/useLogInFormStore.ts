import { create } from 'zustand';
import { LoginReq } from '../types/req-dto/loginReq';

interface LoginFormState {
  formData: LoginReq;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  resetForm: () => void;
}

const initialState = {
  formData: { email: '', password: '' },
  isSubmitting: false,
};

export const useLogInFormStore = create<LoginFormState>((set) => ({
  ...initialState,
  setIsSubmitting: (value) => set({ isSubmitting: value }),
  resetForm: () => set(initialState),
}));
