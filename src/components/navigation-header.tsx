"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const NavigationHeader = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const isAutenticate = status === "authenticated";
  const name = isAutenticate ? data.user?.name : undefined;

  return (
    <header className="py-6 bg-stone-300">
      <nav className="flex w-full px-6 justify-between items-end">
        <div>{name}</div>
        {isAutenticate ? (
          <Button onClick={() => signOut()} className="hover:cursor-pointer">
            Sign out
          </Button>
        ) : (
          <Button
            onClick={() => {
              router.push("/auth");
            }}
            className="hover:cursor-pointer"
          >
            Sign in
          </Button>
        )}
      </nav>
    </header>
  );
};

export default NavigationHeader;
