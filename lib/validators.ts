import { z } from 'zod';
// Type for translation function
type TranslationFunction = (key: string) => string;

// Function to create sign-in schema with translated messages
export const createSignInSchema = (t: TranslationFunction) => {
  return z.object({
    username: z.string().min(1, { message: t('signIn.validation.usernameRequired') }),
    password: z.string().min(1, { message: t('signIn.validation.passwordRequired') }),
  });
};


// Export types
export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>;
