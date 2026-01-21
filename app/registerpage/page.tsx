//Required imports.
import { redirect } from "next/navigation";
import { getSession, login, register } from "../../lib";
import styles from "./page.module.css";
import Link from "next/link";

// Force this page's server actions to run on Node.js runtime (not Edge)
export const runtime = "nodejs";

//Login page title.
export const metadata = {
  title: "Register to my actual first Website!",
  description:
    "Before you go in, you must first enter your email, username, birthdate and password here.",
};

export default async function RegisterPage() {
  //Get a session first before registering.

  const session = await getSession();

  if (session) {
    redirect("/"); //Redirect to home page if already registered in.
  }

  return (
    //The actual form to register.
    <html>
      <body>
        <section className={styles.center_registry}>
          <h1 className={styles.h1register}>Register to React Meetups!</h1>
          <form
            action={async (formData) => {
              "use server";
              await register(formData);
              redirect("/");
            }}
            className={styles.form}
          >
            <input
              name="username"
              className={styles.input}
              type="text"
              placeholder="Username"
              required
            />

            <input
              name="email"
              className={styles.input}
              type="email"
              placeholder="Email"
              required
            />

            <input
              name="password"
              className={styles.input}
              type="password"
              placeholder="Password"
              required
              minLength={8}
            />

            <button type="submit" className={styles.register}>
              Register
            </button>
            <Link href="/login" className={styles.login}>
              Login
            </Link>
          </form>
        </section>
      </body>
    </html>
  );
}
