"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { apiClient, AuthTokenService } from '@/services/api-config';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSignInSchema, SignInFormValues } from "@/lib/validators";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SeparatorWithOr from "@/components/ui/separator-with-or";

export default function CredentialsSignInForm({ callbackUrl = '/' }: { callbackUrl?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  // Create the schema with translated messages
  const signInSchema = createSignInSchema(t);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // First, test the credentials with a direct API call to get user data
      try {
        const apiResponse = await apiClient.post('/auth/login', {
          username: values.username,
          password: values.password
        });
        
        // Extract user role and token from API response
        const userRole = apiResponse.data?.user?.userRole;
        const accessToken = apiResponse.data?.accessToken;
        
        // Debug logging to see the API response structure
        //console.log('API Response:', apiResponse.data);
        //console.log('User Role:', userRole);
        //console.log('Access Token received:', accessToken ? `***TOKEN_START: ${accessToken.substring(0, 50)}...` : 'NO_TOKEN');
        //console.log('Full User Object:', apiResponse.data?.user);
        
        // Store the token in localStorage for API calls
        if (accessToken) {
          AuthTokenService.setToken(accessToken);
          //console.log('✅ Token stored in localStorage for API calls');
        } else {
          //console.error('❌ No access token received from API');
        }
        
        // If the API call succeeds, proceed with NextAuth sign-in
        const result = await signIn('credentials', {
          username: values.username,
          password: values.password,
          redirect: false,
          callbackUrl
        });

        if (result?.error) {
          setError(t('signIn.authenticationFailed'));
          return;
        }

        // Role-based redirection using API response data
        //console.log('Checking role for redirection:', userRole);
        if (userRole === 'SUPER ADMIN') {
          //console.log('Redirecting to admin dashboard');
          router.push('/admin/overview');
        } else {
          //console.log('Redirecting to homepage');
          // Regular customer goes to homepage
          router.push('/');
        }
        
        router.refresh(); // Refresh to update auth state
        
      } catch (apiError: unknown) {
        // If the API call fails, display the specific error message
        if (apiError && typeof apiError === 'object' && 'message' in apiError) {
          setError((apiError as { message: string }).message);
        } else {
          setError(t('signIn.invalidCredentials'));
        }
        return;
      }
      
    } catch (error) {
      setError(t('signIn.unexpectedError'));
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signIn.username')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('signIn.usernamePlaceholder')} 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signIn.password')}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder={t('signIn.passwordPlaceholder')} 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? t('signIn.submitButtonLoading') : t('signIn.submitButton')}
        </Button>
        
        <SeparatorWithOr />
        
        {/* Add social sign-in buttons here if needed */}
      </form>
    </Form>
  );
}
