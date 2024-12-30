"use client"
import styles from "../styles/dashboard.module.css";
import { useSession, signOut } from "next-auth/react";

export default function DashboardClient() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Chargement...</p>;
    }

    if (!session) {
        return <p className={styles.page}>Vous devez ètre connecté pour voir cette page.</p>
    }

    return (
        <div>
            <h1>Bienvenue, {session.user?.email}</h1>
            <button onClick={() => signOut()}>Se déconnecter</button>
        </div>
    )
}