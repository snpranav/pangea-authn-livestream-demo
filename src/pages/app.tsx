import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAuth } from "@pangeacyber/react-auth";
import { useEffect } from 'react';
import Dashboard from '@/components/dashboard_1';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { logout, user, authenticated, getToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(authenticated)
    console.log(user)
    console.log(loading)
    if(!loading && !authenticated) {
        router.push('/')
    }
  }, [user, authenticated])

  return (
    <>
        <Dashboard user={user} logout={logout} authenticated={authenticated} getToken={getToken} router={router} />
        <Toaster />
    </>
  )
}
