"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Session } from "@supabase/supabase-js";
import { useTransactionStore } from "@/stores/transactionStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fetchData = useTransactionStore((state) => state.fetchData);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  const handleAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else if (isSignUp) {
      alert("Registration successful. You can now log in.");
    }
    setLoading(false);
  };

  // ponytail: Minimalist loading state. YAGNI complex skeleton.
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // ponytail: If not logged in, hijacking the entire render tree to show login.
  // No need for Next.js middleware or route groups boilerplate.
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 w-full">
        <Card className="w-full max-w-sm shadow-xl border-primary/10">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl shadow-inner">
              MM
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Money Month</CardTitle>
            <CardDescription>Secure login for your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                // Default to login on enter
                handleAuth(e, false);
              }}
            >
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                {/* ponytail: Native HTML5 validation instead of Regex/Zod bloat */}
                <Input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={(e) => handleAuth(e, false)}
                  disabled={loading || !email || password.length < 6}
                >
                  {loading ? "Please wait..." : "Login"}
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  onClick={(e) => handleAuth(e, true)}
                  disabled={loading || !email || password.length < 6}
                >
                  Register
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged in? Render the rest of the app.
  return <>{children}</>;
}
