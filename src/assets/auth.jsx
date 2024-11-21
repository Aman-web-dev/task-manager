"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import config from "@/config";
import { AuthContext } from "@/Context/authContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation'
import { useContext } from "react";


// Login Validation Schema
const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

// Signup Validation Schema
const signupSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});


const decode=async (token)=>{
const decodedToken= await jwt_decode(token)
return decodedToken
}

export default function AuthPage() {

    const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {jwt,setJwt}=useContext(AuthContext)

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);

        const currentTime = Date.now() / 1000; // in seconds

        console.log(decodedToken)

        if (decodedToken.exp < currentTime) {
          console.log("Token expired, attempting to refresh...");

          if (refreshToken) {
            fetch(`${config.backendUrl}/auth/token/refresh/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh: refreshToken }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.access && data.refresh) {
                  // Store the new tokens in localStorage
                  localStorage.setItem("accessToken", data.access);
                  setJwt(data.access)
                  localStorage.setItem("refreshToken", data.refresh);
                } else {
                  console.error("Failed to refresh tokens");
                }
              })
              .catch((error) => {
                console.error("Error refreshing token:", error);
              });
          }
        } else {
            setJwt(accessToken)
            router.push('/todo');
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.log("No access token found.");
    }
  }, []);

  // Login Form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Signup Form
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Handle Login Submission
  const onLoginSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("Login Values:", values);

      // Make a POST request to the backend
      const response = await fetch(`${config.backendUrl}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Convert form values to JSON
      });

      if (!response.ok) {
        // Handle non-successful responses
        const errorData = await response.json();
        throw new Error(errorData?.message || "Login failed");
      }

      const data = await response.json(); // Parse the response JSON
      console.log("Login successful:", data);

      // Save the tokens in localStorage
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Signup Submission
  const onSignupSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("Signup Values:", values);

      // Make a POST request to the backend
      const response = await fetch(`${config.backendUrl}/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Convert the form values to JSON
      });

      if (!response.ok) {
        // Handle non-successful responses
        const errorData = await response.json();
        throw new Error(errorData?.message || "Signup failed");
      }

      const data = await response.json(); // Parse the response JSON
      console.log("Signup successful:", data);

      alert("Signup successful!");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Login or create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Log In</TabsTrigger>
            </TabsList>

            {/* Login Tab Content */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging In..." : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Signup Tab Content */}
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
