import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@shared/schema";
import { z } from "zod";
import { Helmet } from 'react-helmet';

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, user } = useAuth();
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if already logged in
  if (user) {
    navigate("/admin/dashboard");
    return null;
  }
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    const success = await login(values.email, values.password);
    
    if (!success) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Park Management System</title>
        <meta name="description" content="Access the Park Management System's admin panel to manage drivers, vehicles, and passenger feedback." />
        <meta property="og:title" content="Admin Login - Park Management System" />
        <meta property="og:description" content="Secure login portal for Park Management System administrators." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-heading font-bold text-primary">Admin Login</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access the park management dashboard
            </p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-10"
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...form.register("password")}
                    />
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                      Remember me
                    </Label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary-dark">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  <div className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
