import { logInFormSchema } from '../../lib/validations/auth';
import { z } from 'zod';

export type LogInFormSchema = z.infer<typeof logInFormSchema>;