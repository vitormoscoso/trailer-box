"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SignInDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrar no TrailerBox</DialogTitle>
          <DialogDescription>
            Entre para avaliar filmes e trailers.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => signIn("github")} className="w-full">
          Continuar com GitHub
        </Button>
      </DialogContent>
    </Dialog>
  );
}
