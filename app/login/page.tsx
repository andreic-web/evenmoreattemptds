//Required imports.
import { redirect } from "next/navigation";
import { getSession, login, register } from "@/lib";
import styles from "./page.module.css";
import Link from "next/link";

// Force this page's server actions to run on Node.js runtime (not Edge)
export const runtime = "nodejs";

//Login page title.
export const metadata = {
  title: "Login to my actual first Website!",
  description:
    "Before you go in, you must first enter your email and password here. Only registered users can login.",
};

export default async function Page() {
  //Get a session first before logging in.
  const session = await getSession();

  if (session) {
    redirect("/"); //Redirect to home page if already logged in.
  }
  return (
    //The actual form to login.
    <html>
      <body>
        <section className={styles.center}>
          <h1 className={styles.h1}>Login to React Meetups!</h1>
          <form
            action={async (formData) => {
              "use server";
              await login(formData);
              redirect("/");
            }}
            className={styles.form}
          >
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

            <button type="submit" className={styles.login}>
              Login
            </button>
            <Link href="/registerpage" className={styles.register}>
              Register
            </Link>
          </form>
        </section>
      </body>
    </html>
  );
}
