
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * This page is shown since authentication is disabled.
 */
const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-violet-50 to-pink-100 dark:from-slate-900 dark:via-indigo-900 dark:to-zinc-900 transition-colors duration-500">
      <Card className="p-8 w-full max-w-sm space-y-5 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 animate-fade-in text-center">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-50 tracking-tight mb-2">
          Authentication disabled
        </h2>
        <p className="text-muted-foreground mb-5">
          User login and registration are not available on this app.
        </p>
        <Button className="w-full" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Card>
    </div>
  );
};

export default AuthPage;
