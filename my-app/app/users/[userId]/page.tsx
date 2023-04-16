import getUser from "@/lib/getUser"
import getUserPosts from "@/lib/getUserPosts"
import { Suspense } from "react";
import UserPosts  from "./components/UserPosts";
import type { Metadata } from 'next'
import getAllUsers from "@/lib/getAllUsers";
import { notFound } from 'next/navigation'


type Params = {
    params: {
        userId: string
    }
}

export async function generateMetadata({ params: { userId }}: Params): Promise<Metadata> {
  //we can call this here and down below as Nextjs will remove any reduplicated requests
    const userData: Promise<User> = getUser(userId);
    const user: User = await userData
    if (!user.name) {
      return {
        title: 'User Not Found'
      }
    }
    return {
      title: user.name,
      description: `This is the page of ${user.name}`
    }
  }
  

//every 60 seconds go refetch data on the server
//export const revalidate = 60;

export default async function UserPage({ params: { userId }}: Params) {

  const userData: Promise<User> = getUser(userId);
  const usersPostsData: Promise<Post[]> = getUserPosts(userId);

  //const [user, userPosts] = await Promise.all([userData, usersPostsData]);
  const user = await userData;

  if (!user.name) return notFound()

  return (
    <>
      <h2>{user.name}</h2>
      <br/>
      <Suspense fallback = {<h2>Loading...</h2>}>
        {/* @ts-expect-error Server Component */}
        <UserPosts promise = {usersPostsData} />
      </Suspense>
    </>
  )
}

export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUsers()
  const users = await usersData

  return users.map(user => ({
    userId: String(user.id) 
  }))
}
