import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_URL: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  BCRYPT_SALT: z.string().min(1),
});

export const environment = envSchema.parse(process.env);
