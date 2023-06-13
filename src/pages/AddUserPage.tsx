import { FormEvent, useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { store } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Toaster, toast } from "react-hot-toast";

export default function AddUserPage() {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Tambah Pengguna - Smart Inkubator";
  }, []);

  async function handleSubmit(e: FormEvent) {
    setLoading(true);
    e.preventDefault();
    const form = (e.currentTarget as HTMLFormElement)
      .elements as HTMLFormControlsCollection;
    const name = form[0] as HTMLInputElement;
    const username = form[1] as HTMLInputElement;
    const email = form[2] as HTMLInputElement;
    const password = form[3] as HTMLInputElement;

    try {
      // menambahkan user baru
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const newUser = userCredential.user;

      await updateProfile(newUser, {
        displayName: name.value,
      });

      const userRef = doc(store, "users", newUser.uid);

      // menambahkan data user baru di firestore
      await setDoc(userRef, {
        name: name.value,
        username: username.value,
        email: email.value,
        role: "reader",
        createdAt: Timestamp.now(),
      });

      // buat notifikasi berhasil
      toast.success("Pengguna baru berhasil ditambahkan👌");
    } catch (error) {
      console.log(error);
      // biat notif gagall jika data gaagal di tambahkan
      toast.error("Pengguna baru gagal ditambahkan😑");
    } finally {
      setLoading(false);
      name.value = "";
      username.value = "";
      email.value = "";
      password.value = "";
    }
  }

  return (
    <div className="w-full px-4 xl:px-0 sm:px-2 my-5 lg:w-3/4 md:w-full">
      <Toaster />
      <h1 className="text-2xl font-semibold text-amber-800 mb-6 md:mb-8">
        Tambah Data Pengguna
      </h1>
      <form action="#" onSubmit={handleSubmit}>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:mr-2 md:mr-5">
            <FormInput
              id="name"
              placeholder="Full Name"
              required={true}
              label="Full Name"
            />
            <FormInput
              id="username"
              placeholder="Enter Username"
              label="Username"
              required={true}
            />
          </div>
          <div className="sm:ml-2 md:ml-5">
            <FormInput
              id="email"
              placeholder="Enter Email"
              type="email"
              label="Email"
              required={true}
            />
            <FormInput
              id="password"
              placeholder="Enter Password"
              type="password"
              label="Password"
              required={true}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-14 text-center font-bold bg-amber-700 hover:bg-amber-600 rounded-xl px-10 py-3 text-amber-50 tracking-widest"
        >
          {loading ? "Please Wait..." : "Save Data"}
        </button>
      </form>
    </div>
  );
}
