import pool from "../../utils/db";
import bcrypt from "bcrypt";

export async function POST(req, res) {
    const { email, password } = await req.json();

    try {
        //recherche de l'utilisateur dans la bd
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ message: "utilisateur non trouvé" }),
                { status: 404 }
            );
        }

        const user = rows[0];

        //Comparaison des mots de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new Response(
                JSON.stringify({ message: "Mot de passe incorrect" }),
                { status: 401 }
            );
        }

        //Envoi de la reponce positive
        return new Response(
            JSON.stringify({ message: "connexion réussie", userId: user.id }),
            { status: 200 }
        );

    } catch(error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Erreur lors de la connexion" }),
            { status: 500 }
        );
    }
}
