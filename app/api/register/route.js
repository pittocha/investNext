import pool from "../../utils/db";
import bcrypt from "bcrypt";


//Depuis next.js 13 les routes d'API doivent exporter des fonction nommées avec la methode HTTP( ici POST ) et pas de default pour ces fonctions 
export async function POST(req, res) {
    const { email, password } = await req.json() // `req.json()` doit être utilisé pour lire le corps dans la nouvelle API
    console.log("DB_USER",process.env.DB_USER);
    try {
        //hashage du mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //execution de la requette
        const [ reslut ] = await pool.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        return new Response(
            JSON.stringify({ message: 'Utilisateur enregistré', userId: reslut.insertId }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Erreur lors de l'inscription" }),
            { status: 500 }
        );
    }
}

//les methodes unothaurized sont gerées par next