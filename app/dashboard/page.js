import styles from "../styles/dashboard.module.css";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...naxtauth]"
import DashboardClient from "./dashboardClient";

export default async function Dashboard() {

    const session = await getServerSession(authOption)

    if (!session) return <p className={styles.page}>vous devez etre connecté pour voir cette page.</p>;

    return (
        <div className={styles.page}>
            <DashboardClient />
        </div>
    )
};
