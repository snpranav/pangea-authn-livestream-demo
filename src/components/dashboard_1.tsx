/**
 * v0 by Vercel.
 * @see https://v0.dev/t/O22ggdWopTq
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/initSupabase";
import { AuthUser } from "@pangeacyber/react-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard({user, logout, authenticated, getToken, router}: AuthUser) {
  const [preloaderStatus, setPreloaderStatus] = useState(true);
  const [flavor, setFlavor] = useState("");
  const { toast } = useToast()

  useEffect(() => {
    setPreloaderStatus(false)
  }, [user, authenticated])

  const submitEntry = async () => {
    try {
        const { data, error } = await supabase
            .from("ice_cream")
            .insert({
                email: user.email,
                name: user.profile.last_name ? `${user.profile.first_name} ${user.profile.last_name}` : user.profile.first_name,
                ice_cream_flavor: flavor
            }).single()
    } catch (error) {
        console.error(error);
    }
  }

  const geolocate = async () => {
    const authToken = await getToken();

    await fetch('/api/geolocate', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            "proxy": false
        }),
        })
        .then(response => response.json()) 
        .then(data => {
            toast({
                title: `city: ${data.city}`,
                description: `country: ${data.country}`
            })
        })
        .catch((error) => console.error('Error:', error));
  }

  const isProxy = async () => {
    const authToken = await getToken();

    await fetch('/api/geolocate', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            "proxy": true
        }),
        })
        .then(response => response.json()) 
        .then(data => {
            toast({
                title: `Proxy?: ${data}`,
            })
        })
        .catch((error) => console.error('Error:', error));
  }

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-[#bd1e59] bg-opacity-30 bg-cover"
      style={{
        backgroundImage: "url(/futuristic-barbie-world-background.jpg)",
      }}
    >
      <header className="p-4 bg-pink-500 text-white text-lg font-bold flex justify-between items-center backdrop-filter backdrop-blur-lg bg-opacity-60">
        <h1>Barbie World</h1>
        <div className="relative">
          <div className="flex items-center cursor-pointer">
            <img
              alt="User Profile"
              className="rounded-full mr-2"
              height="32"
              src={user?.profile.image_url}
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <p className="text-sm">
                Welcome, <span className="font-medium">{user?.profile.first_name}</span> 👋
            </p>
            <svg
              className=" ml-2 w-4 h-4"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="m9 15 3 3 3-3" />
            </svg>
          </div>
          <div className="absolute top-full right-0 mt-2 w-48 bg-black rounded-lg shadow-md overflow-hidden z-10">
            <Button className="w-full text-left p-2 hover:bg-gray-700" type="button" onClick={() => {
                logout();
                router.push('/')
            }}>
              <svg
                className=" mr-2 w-4 h-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-10">
        <section className="flex flex-col bg-white shadow-sm rounded-lg p-4 backdrop-filter backdrop-blur-lg bg-opacity-60">
          <h2 className="text-lg font-semibold mb-2">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center bg-pink-100 rounded-lg p-4">
              <p className="text-2xl font-bold">100</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-pink-100 rounded-lg p-4">
              <p className="text-2xl font-bold">50</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </section>
        <section className="flex flex-col bg-white shadow-sm rounded-lg p-4 backdrop-filter backdrop-blur-lg bg-opacity-60">
          <h2 className="text-lg font-semibold mb-2">Submit User Data</h2>
          <form className="flex flex-col gap-2">
            <Input className="border rounded-lg p-2" disabled placeholder="Enter Name" type="text" value={user?.profile.first_name} />
            <Input
              className="border rounded-lg p-2"
              disabled
              placeholder="Enter Email"
              type="email"
              value={user?.email}
            />
            <Input className="border rounded-lg p-2" placeholder="Favorite Ice Cream Flavor" onChange={(e) => {
                setFlavor(e.target.value)
            }} type="text" required />
            <Button className="bg-pink-500 text-white rounded-lg p-2" onClick={e => {
                e.preventDefault();
                submitEntry();
            }} type="submit">
              Submit
            </Button>

            <div className="flex justify-between mt-4">
              <Button className="bg-pink-500 text-white rounded-lg py-2 px-4 flex-grow mr-2" type="button" onClick={geolocate}>
                Geolocate Me 🫣
              </Button>
              <Button className="bg-pink-500 text-white rounded-lg py-2 px-4 flex-grow ml-2" type="button" onClick={isProxy}>
                Am I on a Proxy? 🧐
              </Button>
            </div>
          </form>
        </section>
      </main>
      <div className={`fixed top-0 left-0 w-full h-full bg-white opacity-75 flex justify-center items-center z-50  ${preloaderStatus == false ? "hidden" : ""}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500" />
      </div>
    </div>
  )
}
