"use client"
import styles from "../styles/dashboard.module.css";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {

    const { data: session } = useSession();

    if (!session) return <p className={styles.page}>vous devez etre connecté pour voir cette page.</p>;

    return (
        <div className={styles.page}>
            <h1>Bienvenue, {session.user.email}</h1>
            <button onClick={() => signOut()}>Se déconnecter</button>
        </div>
    )
};

{/* snipet pour proteger les pages qui necessite d'etre connecter
    import { useSession } from "next-auth/react";
    import { useRouter } from 'next/router';
    import { useEffect } from 'react';

    const ProtectedPage = () => {
        const { data: session, status } = useSession();
        const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") return <p>Chargement...</p>;
    return <p>Contenu de la page protégée</p>;
    };
    */}