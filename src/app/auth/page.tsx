import AuthForm from "@/app/auth/_components/auth-form";
import getSession from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <AuthForm />
    </div>
  );
}
