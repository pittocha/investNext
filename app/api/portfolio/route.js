import { NextResponse } from "next/server";
import { pool } from "../../utils/db";

export async function GET(request) {
    try {
        const [rows] = await pool.query(`
            SELECT
                h.id,
                h.assetSymbol,
                h.quantity,
                h.pru,
                ap.price AS currentPrice
            FROM holdings h
            LEFT JOIN (
                SELECT assetSymbol, MAX(date) AS latestDate
                FROM asset_prices
                GROUP BY assetSymbol
                ) latest ON h.assetSymbol = latest.assetSymbol
            LEFT JOIN asset_prices ap
                ON h.assetSymbol = ap.assetSymbol AND latest.latestDate = ap.date
            `);
        //Retourner les données au format JSON
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return new NextResponse('Erreur serveur', { status: 500 });
    }
}

