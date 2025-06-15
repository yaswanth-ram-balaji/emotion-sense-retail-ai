
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const AuthPage: React.FC = () => {
  const { user, loading, signUp, signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user) navigate("/");
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) toast({ title: "Login failed", description: error });
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Signup failed", description: error });
      } else {
        toast({ title: "Check your email", description: "Click the link in your email to complete signup." });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="p-8 w-full max-w-sm space-y-6">
        <h2 className="text-xl font-bold text-center">{isLogin ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            autoFocus
          />
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (isLogin ? "Signing In..." : "Signing Up...") : (isLogin ? "Sign In" : "Sign Up")}
          </Button>
        </form>
        <div className="text-center">
          <button
            className="text-blue-500 underline text-xs"
            onClick={() => setIsLogin(l => !l)}
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
