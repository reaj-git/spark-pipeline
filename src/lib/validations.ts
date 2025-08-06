import { z } from 'zod';

// Auth validation schemas
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must be at least 6 characters'
    ),
});

// Prospect validation schema
export const prospectSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
//   phone: z
//     .string()
//     .optional()
//     .refine((phone) => {
//       if (!phone || phone.trim() === '') return true;
//       try {
//         return isValidPhoneNumber(phone);
//       } catch {
//         return false;
//       }
//     }, 'Please enter a valid phone number'),
  company: z
    .string()
    .max(100, 'Company name must not exceed 100 characters')
    .optional(),
  stage: z.enum(['new', 'in_talks', 'closed'], {
    required_error: 'Please select a pipeline stage',
  }),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional(),
});

// forgot passworf validation schema
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

// profile validation schema
export const profilePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters long."),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

  // reset password validation schema

  export const resetPasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


// Type exports
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProspectFormData = z.infer<typeof prospectSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProfilePasswordFormData = z.infer<typeof profilePasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

