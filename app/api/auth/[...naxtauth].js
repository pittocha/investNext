import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/ptoviders/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "email", type: "text"},
                password: { labell: "password", type: "password"},
            },
            async authorize(credentials) {
                //appel à l'apipour vérifier les information
                const res = await fetch("../login/route", {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });

                const user = await res.json();

                //si l'authentification est réussi
                if (res.ok && user) {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session ({ session, token }) {
            session.user.id = token.id;
            return session;
        }
    },
    session: {
        jwt: true,
    },
    secret: process.env.NEXTAUTH_SECRET,
});