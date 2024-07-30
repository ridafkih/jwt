import { type NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return NextResponse.redirect(new URL("/", request.url), {
    headers: {
      "set-cookie": "session=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict",
    }
  })
}