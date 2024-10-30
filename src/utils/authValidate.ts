import { z } from "zod";

export const validateSignUpSchema = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}) => {
  const signUpSchema = z
    .object({
      name: z.string().nonempty("Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string()
        .min(8, "Confirm Password must be at least 8 characters"),
      phoneNumber: z.string().nonempty("Phone number is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  return signUpSchema.safeParse(data);
};

export const validateLoginSchema = (data: {
  email: string;
  password: string;
}) => {
  const loginSchema = z
    .object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })
    .required();

  return loginSchema.safeParse(data);
};
