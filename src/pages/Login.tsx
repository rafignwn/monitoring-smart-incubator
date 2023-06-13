import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { auth, store } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import incubationIcon from "../assets/incubator.png";
import { getDoc, doc } from "firebase/firestore";

export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigate();
  const { dispatch } = useContext(AuthContext);

  // handle login function
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const email: string | undefined = emailRef?.current?.value;
    const password: string | undefined = passwordRef?.current?.value;

    try {
      if (email && password) {
        const res = await signInWithEmailAndPassword(auth, email, password);

        // data user yang login
        const signedUser = res.user;

        // cek data user yang login di users conlection
        const docUser = await getDoc(doc(store, "users", signedUser.uid));

        if (!docUser.exists()) {
          throw { error: "Dokumen akun sudah tidak tersedia!" };
        }
        const currenUser = { uid: docUser.id, ...docUser.data() };
        dispatch({ type: "LOGIN", payload: currenUser });

        navigation("/");
      }
    } catch (error) {
      console.log(error);
      setError("Email atau Password salah!");

      if (emailRef.current && passwordRef.current) {
        emailRef.current.value = "";
        passwordRef.current.value = "";
        emailRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = "Login - Monitoring Suhu";
  }, []);

  return (
    <div className="w-full min-h-full md:h-full h-fit flex-col bg-sky-100 flex items-start md:items-center justify-center box-border">
      <div className="flex flex-col md:flex-row gap-10 h-full items-center md:mb-0 md:mt-0 md:justify-center mb-10 mt-10 px-2">
        <div className="flex flex-col items-center md:px-3 md:self-stretch rounded-xl justify-center">
          <img src={incubationIcon} alt="logo" className="mb-10" />
          <h1 className="mb-10 font-semibold text-sky-700 text-4xl text-center w-full md:w-2/3 px-5">
            Sistem Monitoring Smart Incubator Berbasis IOT
          </h1>
        </div>
        <div className="flex w-fit flex-col items-center bg-sky-600 p-5 md:p-8 rounded-xl shadow-gray-300 shadow-lg">
          <h1 className="text-sky-50 font-bold text-3xl mb-10 underline">
            Login
          </h1>
          {error ? (
            <p className="text-red-600 bg-red-200 font-medium px-2 mb-3 rounded-md self-start">
              {error}
            </p>
          ) : (
            ""
          )}
          <form action="#" onSubmit={handleLogin}>
            <label htmlFor="email" className="flex flex-col">
              <span className="mb-2 text-sky-50 font-semibold">Email</span>
              <input
                ref={emailRef}
                className="px-4 py-2 text-base text-sky-700 placeholder:text-yellow-500 outline-none border-none rounded-md w-80 mb-5"
                id="email"
                type="email"
                required
                placeholder="Enter Email"
              />
            </label>
            <label htmlFor="password" className="flex flex-col">
              <span className="mb-2 text-sky-50 font-semibold">Password</span>
              <input
                ref={passwordRef}
                id="password"
                className="px-4 py-2 text-base text-sky-700 placeholder:text-yellow-500 outline-none border-none rounded-md w-80 mb-10"
                type="password"
                required
                placeholder="Enter Password"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className={`text-base tracking-wide font-bold ${
                loading ? "pointer-events-none" : ""
              } w-full text-center py-2 text-sky-800 hover:bg-sky-300 bg-sky-200 rounded-md`}
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-emerald-300 w-full py-4 justify-self-end flex items-center px-5 text-emerald-800 font-medium">
        <h1 className="text-center w-full">&copy; Akhmad Rizki S - 20040090</h1>
      </footer>
    </div>
  );
}
