import Image from "next/image";
import styles from "./page.module.css";
import Form from "./components/form";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Bienvenue sur notre site</h1>
        <p>Découvré nos service, inscriver vous ou connecter vous.</p>
        
        <Form />
      </main>
    </div>
  );
}
