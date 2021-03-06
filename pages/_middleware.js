import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export const middleware = async (req) => {
  // Token exists if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const { pathname } = req.nextUrl
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  } else if (!token && pathname !== '/login') {
    if (process.env.NEXTAUTH_URL === 'http://localhost:3000')
      return NextResponse.redirect('http://localhost:3000/login')
    else return NextResponse.redirect('https://spotify-boost.vercel.app/login')
  }
}
