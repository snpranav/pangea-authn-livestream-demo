import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAuth } from "@pangeacyber/react-auth";
import { useEffect } from 'react';
import Dashboard from '@/components/dashboard_1';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { logout, user, authenticated, getToken } = useAuth();

  useEffect(() => {
    console.log(user);
    console.log(authenticated);
  }, [user, authenticated])



  return (
    <>
        <Dashboard user={user} logout={logout} authenticated={authenticated} getToken={getToken} />
        <Toaster />
    </>
  )
}
