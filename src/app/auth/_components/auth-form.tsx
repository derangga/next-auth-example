"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  FormEvent,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { registerAction } from "@/app/auth/_actions/auth";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const AuthForm = () => {
  const [registerState, registerActionForm, isLoading] = useActionState(
    registerAction,
    null
  );
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const switchTab = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  useEffect(() => {
    if (registerState) {
      router.refresh();
    }
  }, [registerState, router]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      try {
        setIsLoginLoading(true);
        const formVerify = loginFormSchema.parse({
          email: formData.get("email"),
          password: formData.get("password"),
        });

        const response = await signIn("credentials", {
          email: formVerify.email,
          password: formVerify.password,
          redirect: false,
        });
        if (!response?.ok) {
          setIsLoginLoading(false);
          toast.error("Make sure you use correct credential", {
            duration: 1000,
            closeButton: true,
            dismissible: true,
          });
          return;
        }

        router.replace(callbackUrl || "/");
      } catch (error) {
        setIsLoginLoading(false);
        console.error(`[ERROR]: ${error}`);
      }
    },
    [router, callbackUrl]
  );

  return (
    <Tabs value={selectedTab} onValueChange={switchTab} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Sign in</TabsTrigger>
        <TabsTrigger value="register">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading && <Loader2 className="animate-spin" />}
                  {!isLoginLoading ? "Sign in" : "Please wait"}
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  onClick={() => switchTab("register")}
                  className="underline underline-offset-4 hover:cursor-pointer"
                >
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <form action={registerActionForm}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  {!isLoading ? "Sign up" : "Please wait"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a
                  onClick={() => switchTab("login")}
                  className="underline underline-offset-4 hover:cursor-pointer"
                >
                  Sign in
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
