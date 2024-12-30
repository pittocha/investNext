import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtVerify, SignJWT } from "jose";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "email", type: "text"},
                password: { label: "password", type: "password"},
            },
            async authorize(credentials) {
                //appel à l'api pour vérifier les information (lors du déploiement penser a ajouter ${process.env.NEXTAUTH_URL} dans l'adresse de l'api qui est fetch)
                const res = await fetch("/api/login", {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                });

                if (!res.ok) {
                    throw new Error("Authentification failed");
                }

                const user = await res.json();

                //si l'authentification est réussi
                if (user) {
                    return user;
                }

                return null;
            }
        })
    ],

    jwt: {
        encode: async ({ secret, token }) => {
            return new SignJWT(token)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(new TextEncoder().encode(secret));
        },
        decode: async ({ secret, token }) => {
            const { payload } = await jwtVerify(token || "", new TextEncoder(),encode(secret));
            return payload;
        }
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session ({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
});