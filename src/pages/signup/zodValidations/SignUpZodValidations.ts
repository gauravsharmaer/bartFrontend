import { z } from "zod";

const Step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const Step2Schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const validateSignUpSchema = (data: {
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

export { Step1Schema, Step2Schema, validateSignUpSchema };
