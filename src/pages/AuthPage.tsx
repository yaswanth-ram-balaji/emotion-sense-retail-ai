
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const AuthPage: React.FC = () => {
  const { user, loading, signUp, signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user) navigate("/");
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error)
        toast({ title: "Login failed", description: error });
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Signup failed", description: error });
      } else {
        toast({
          title: "Check your email",
          description: "Click the link in your email to complete signup.",
        });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-violet-50 to-pink-100 dark:from-slate-900 dark:via-indigo-900 dark:to-zinc-900 transition-colors duration-500">
      <Card className="p-8 w-full max-w-sm space-y-5 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 animate-fade-in">
        <div className="flex flex-col items-center gap-2 mb-2">
          <img
            src="https://em-content.zobj.net/source/telegram/386/sparkles_2728.png"
            alt="Logo"
            className="w-10 h-10 animate-scale-in"
          />
          <h2 className="text-2xl font-bold text-center font-playfair text-blue-900 dark:text-blue-50 tracking-tight">
            {isLogin ? "Welcome Back!" : "Join our community"}
          </h2>
          <p className="text-muted-foreground text-xs text-center">
            {isLogin
              ? "Sign in to continue to your account"
              : "Create an account to get started!"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="sr-only">Email</label>
            <Input
              id="auth-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Email"
              autoFocus
              className="bg-white/80 dark:bg-transparent border-blue-100"
            />
          </div>
          <div className="relative">
            <label htmlFor="auth-password" className="sr-only">Password</label>
            <Input
              id="auth-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pr-12 bg-white/80 dark:bg-transparent border-blue-100"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500"
              tabIndex={0}
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>
          <Button
            type="submit"
            className="w-full mt-1 shadow hover-scale"
            disabled={submitting}
          >
            {submitting
              ? isLogin
                ? "Signing In..."
                : "Signing Up..."
              : isLogin
              ? "Sign In"
              : "Sign Up"}
          </Button>
        </form>
        <div className="text-center pt-1">
          <button
            className="text-blue-500 underline text-xs story-link"
            onClick={() => setIsLogin((l) => !l)}
            type="button"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
