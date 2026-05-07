'use client';

import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { Suspense, useEffect } from 'react'
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CredentialsSignInForm from './credentials-signin-form'

function SignInContent() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = '/'
  
  // Use a ref to track if we've shown the expired toast to avoid duplicates
  const expiredToastShown = React.useRef(false)
  
  // Handle session expiry toast
  useEffect(() => {
    const expired = searchParams.get('expired')
    if (expired === 'true' && !expiredToastShown.current) {
      expiredToastShown.current = true
      toast.error('Your session has expired. Please sign in again.')
    }
  }, [searchParams])

  // Handle redirect for authenticated users
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as { role?: string }).role;
      // Check for SUPER ADMIN role
      if (userRole === 'SUPER ADMIN') {
        router.push('/admin/overview')
      } else {
        router.push('/')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return <div>Redirecting...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('signIn.title')}</h1>
        <div className='w-full max-w-md'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>{t('signIn.submitButton')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <CredentialsSignInForm callbackUrl={callbackUrl} />
              </div>
            </CardContent>
          </Card>
          {/* <SeparatorWithOr>{t('signIn.noAccount')}</SeparatorWithOr>

          <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            <Button className='w-full' variant='outline'>
              {t('signIn.signUpLink')}
            </Button>
          </Link> */}
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
