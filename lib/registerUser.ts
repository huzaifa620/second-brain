"use server";
import { ZodError, z } from "zod";
import { hash } from "bcrypt";
import { signIn } from "next-auth/react";
import db from "./db";
import { loginUser } from "./loginUser";

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // await new Promise((r) => setTimeout(r, 10000));
  if (!email || !password) {
    return {
      success: false,
      message: "Please Provide email and password",
    };
  }
  try {
    z.string().email().parse(email);
  } catch (e) {
    return {
      success: false,
      message: "Please Provide valid email",
    };
  }
  try {
    z.string().min(8).max(20).parse(password);
  } catch (err: unknown) {
    // Changed err type to unknown
    // Now we need to assert the type of err to be ZodError before accessing its properties
    if (err instanceof ZodError) {
      // Here TypeScript knows err is ZodError
      // console.log(err.errors[0].message);
      return {
        success: false,
        message: err.errors[0].message,
      };
    } else {
      // Handle other error types or rethrow
      console.error("An unexpected error occurred", err);
    }
    return {
      success: false,
      message: "Please Provide valid password",
    };
  }
  const hashedPassword = await hash(password, 10);
  try {
    await db.user.create({
      data: { email: email, hashpassword: hashedPassword },
    });

    return { success: true, message: "Created the new user" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something went wrong" };
  }

  //   console.log({ response });
  // console.log("Get the object", { email, password, name });
}
