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

// German phone number validation
// Mobile: +49 1XX XXXXXXXX (prefixes: 015x, 016x, 017x)
// Landline: +49 XXX XXXXXXX (e.g., +49 40 12345678)
// Toll-free: +49 800 XXXXXXX
const germanPhoneRegex = /^(\+49\s?)?(0?1[567]\d[\s]?\d{7,8}|0?[2-9]\d{1,4}[\s]?\d{5,8}|0?800[\s]?\d{7})$/;

// Product inquiry form validation schema
export const createInquirySchema = (locale: string = 'de') => {
  const messages = {
    de: {
      nameRequired: 'Name ist erforderlich',
      nameMin: 'Name muss mindestens 2 Zeichen lang sein',
      emailRequired: 'E-Mail ist erforderlich',
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      phoneInvalid: 'Bitte geben Sie eine gültige Telefonnummer ein (z.B. 151 23456789 oder 40 12345678)',
    },
    en: {
      nameRequired: 'Name is required',
      nameMin: 'Name must be at least 2 characters',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email address',
      phoneInvalid: 'Please enter a valid phone number (e.g. 151 23456789 or 40 12345678)',
    },
  };

  const t = messages[locale as keyof typeof messages] || messages.de;

  return z.object({
    name: z
      .string()
      .min(1, { message: t.nameRequired })
      .min(2, { message: t.nameMin }),
    email: z
      .string()
      .min(1, { message: t.emailRequired })
      .email({ message: t.emailInvalid }),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || val === '' || germanPhoneRegex.test(val.replace(/[\s\-]/g, '')),
        { message: t.phoneInvalid }
      ),
  });
};

// Export types
export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>;
export type InquiryFormValues = z.infer<ReturnType<typeof createInquirySchema>>;
