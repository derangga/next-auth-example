"use server";
import { z } from "zod";
import prisma from "@/lib/prisma-client";
import bcrypt from "bcrypt";
import { environment } from "@/lib/environment";

const registerFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export async function registerAction(_: unknown, formData: FormData) {
  try {
    const form = registerFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const hashPw = await bcrypt.hash(
      form.password,
      Number(environment.BCRYPT_SALT)
    );

    const user = prisma.user.create({
      data: {
        name: form.name,
        email: form.email,
        password: hashPw,
      },
    });
    return user;
  } catch (error) {
    console.error(`[ERROR] register: ${error}`);
    return null;
  }
}
