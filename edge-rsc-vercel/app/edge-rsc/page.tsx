import { headers } from 'next/headers'

export const runtime = 'edge'

export default async function EdgeRscPage() {
  const nextUrl = (await headers()).get('next-url') ?? 'none'

  return (
    <main>
      <h1>Edge RSC</h1>
      <p>next-url: {nextUrl}</p>
    </main>
  )
}
