"use client"
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import styles from "../styles/form.module.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function Home() {
  const [ showLogin, setShowLogin ] = useState(true);
  const [ status, setstatus ] = useState('Envoyer');
  const { data: session } = useSession();
  const router = useRouter();

  /*fonction pour afficher/masquer le mot de passe */
  const handleToggleForm = (isLogin) => {
    setShowLogin(isLogin);
  };

  const [ passwordVisible, setPasswordVisible ] = useState(false);

  const handleClick = () => {
    setPasswordVisible(!passwordVisible);
  }

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    const loginEmail = event.target.elements.login_email.value;
    const loginPassword = event.target.elements.login_password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
    });

    if (result?.error) {
      //gérer l'erreur
      setNotification({ error: true, message: "une erreur est survenue"});
    } else {
      //redirige l'utilisateur
      router.push('/dashboard');
    }
  };

  const handleSubmitRegister = async (event) => {
    event.preventDefault();
    const registerEmail = event.target.elements.register_email.value;
    const registerPassword = event.target.elements.register_password.value;

    try {
      //appel de l'API d'inscription
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        //inscription réussi, connection automatique
        const result = await signIn("credentials", {
          redirect: false,
          email: registerEmail,
          password: registerPassword,
        });

        if (result?.error) {
          setNotification({ error: true, message: "Erreur lors de la connexion automatique"});
        } else {
          router.push('/dashboard');
        }
      } else {
        //gestion des erreur de l'API
        setNotification({error: true, message: "une erreur est survenue lors de l'inscription"});
      }
    } catch (err) {
      //gestion de l'erreur de requette
      setNotification({error: true, message: "une erreur est survenue lors de l'inscription"});
    }
  }

  return (
    <div>
        {/*selecteur de formulaire */}
        <div className={styles.formSelector}>
          <div className={showLogin ? styles.loginActive : styles.loginInactive} onClick={() => handleToggleForm(true)}>Login</div>
          <div className={!showLogin ? styles.registerActive : styles.registerInactive} onClick={() => handleToggleForm(false)}>Register</div>
        </div>
        {showLogin ? (
          /*formulaire de connexion*/
          <form onSubmit={handleSubmitLogin} className={styles.login} method='post'>
            <label className={styles.loginTitle}>Se connecter</label>
            <label htmlFor='email' className={styles.formLabel}>Email</label>
            <input type='email' name='email' id='login_email' placeholder='Entrez votre Email' required/>
            <label htmlFor='password' className={styles.formLabel}>Password</label>
            <div className={styles.passWrapper}>
              <input type={passwordVisible ? 'text' : 'password'} name='password' id='login_password' placeholder='Entrez votre mot de passe' required/>
              <span onClick={handleClick} className={styles.eye}>
                {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            <button type='submit' className={styles.formButton}>{status}</button>
          </form>
         ) : (
          /*formulaire d'inscription */
          <form onSubmit={handleSubmitRegister} className={styles.register} method='post'>
            <label className={styles.registerTitle}>S'enregistrer</label>
            <label htmlFor='email' className={styles.formLabel}>Email</label>
            <input type='email' name='email' id='register_email' placeholder='Entrez votre Email' required/>
            <label htmlFor='password' className={styles.formLabel}>Password</label>
            <div className={styles.passWrapper}>
              <input type={passwordVisible ? 'text' : 'password'} name='password' id='register_password' placeholder='Entrez votre mot de passe' required/>
              <span onClick={handleClick} className={styles.eye}>
                {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            <button type='submit' className={styles.formButton}>{status}</button>
          </form>
        )}
    </div>   

    );
  
}