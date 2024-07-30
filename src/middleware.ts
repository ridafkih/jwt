import { SignJWT, jwtVerify } from 'jose'
import { NextConfig } from "next"
import { NextRequest, NextResponse } from "next/server"

const JWT_SECRET_BYTES = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  if (!process.env.JWT_SECRET) {
    throw new Error("No JWT_SECRET environment variable found.")
  }

  const cookie = request.cookies.get('session')?.value
  
  let visits = 0

  if (cookie) {
    try {
      const { payload } = await jwtVerify(cookie, JWT_SECRET_BYTES, { algorithms: ['HS256'] })
      if (typeof payload.visits === 'number') {
        visits = payload.visits + 1
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/logout", request.url))
    }
  }

  const response = await NextResponse.next()

  const newToken = await new SignJWT({ visits })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(JWT_SECRET_BYTES)

  response.cookies.set({
    name: 'session',
    value: newToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  return response
}

export const config: NextConfig = {
  matcher: '/',
}
