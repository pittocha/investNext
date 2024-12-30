import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

//liste des routes protégées
const protectedRoutes = ["/dashboard"];

export async function middleware(req) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    //redirection d'utilisateur non identifié
    if (protectedRoutes.includes(pathname) && !token) {
        const loginUrl = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard"],
};