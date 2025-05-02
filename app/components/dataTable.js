"use client";
import styles from "../styles/dataTable.module.css";
import { useState, useEffect } from "react";


export default function PortfolioTable() {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetch('/api/portfolio')
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }, [])
    

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableHeaderCell}>Titre</th>
                        <th className={styles.tableHeaderCell}>Quantité</th>
                        <th className={styles.tableHeaderCell}>PRU</th>
                        <th className={styles.tableHeaderCell}>Montant</th>
                        <th className={styles.tableHeaderCell}>cours actuel</th>
                        <th className={styles.tableHeaderCell}>+/- value (%)</th>
                        <th className={styles.tableHeaderCell}>+/- value (€)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => {
                        const montant = item.quantity * item.pru;
                        // calcul de la plus value
                        const plusValueAbsolue = item.currentPrice != null ? (item.currentPrice - item.pru) * item.quantity: null;
                        // calcul de la plus value en pourcentage
                        const plusValuePourcentage = item.currentPrice != null ? ((item.currentPrice - item.pru) / item.pru) * 100 : null;

                        return (
                            <tr key={idx}>
                                <td>{item.assetSymbol}</td>
                                <td>{item.quantity}</td>
                                <td>{item.pru.toFixed(2) ?? 'N/A'} €</td>
                                <td>{montant.toFixed(2) ?? 'N/A'} €</td>
                                <td>{item.currentPrice?.toFixed(2) ?? 'N/A'} €</td>
                                <td>{plusValuePourcentage != null ? `${plusValuePourcentage.toFixed(2)} %` : 'N/A'}</td>
                                <td>{plusValueAbsolue != null ? `${plusValueAbsolue.toFixed(2)} €` : 'N/A'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};