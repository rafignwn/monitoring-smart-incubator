import { FormEvent, useContext, useState } from "react";
import FormInput from "../components/FormInput";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { auth, store } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";
import {
  EmailAuthProvider,
  User,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";

export default function EditUserPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigate();
  const { currentUser, dispatch } = useContext(AuthContext);

  async function handleSubmit(e: FormEvent) {
    setLoading(true);
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const name = form[0] as HTMLInputElement;
    const username = form[1] as HTMLInputElement;
    const phone = form[2] as HTMLInputElement;
    const email = form[3] as HTMLInputElement;
    const oldPw = form[4] as HTMLInputElement;
    const newPw = form[5] as HTMLInputElement;

    function clear() {
      oldPw.value = "";
      newPw.value = "";
    }

    async function updateUserDoc() {
      try {
        let data: {
          name: string;
          username: string;
          phone?: string;
          email: string;
          updatedAt: Timestamp;
        } = {
          name: name.value,
          username: username.value,
          email: email.value,
          updatedAt: Timestamp.now(),
        };

        if (phone.value) {
          data = { phone: phone.value, ...data };
        }

        await updateDoc(doc(store, "users", currentUser?.uid as string), data);

        dispatch({ type: "LOGIN", payload: { ...currentUser, ...data } });
        // kirim notif berhasil update
        toast.success("Data profile berhasil diupdate!", {
          duration: 4000,
        });
        clear();
        navigation("/");
      } catch (error) {
        throw "Gagal bro";
      }
    }

    try {
      // jika form password tidak kosong maka update password
      let emailUpdated: boolean = false;
      if (oldPw.value && newPw.value) {
        await signInWithEmailAndPassword(
          auth,
          currentUser?.email as string,
          oldPw.value
        );
        const user = auth.currentUser as User;

        await updatePassword(user, newPw.value);

        // jika email lama tidak sama dengan email di form email
        // maka update email
        if ((currentUser?.email as string) !== email.value) {
          await updateEmail(user, email.value);
          emailUpdated = true;
        }
      }

      // jika email lama tidak sama dengan email di form email
      // maka update email jika belum di update
      if ((currentUser?.email as string) !== email.value && !emailUpdated) {
        async function handleSubmitToast(e: FormEvent) {
          setLoading(true);
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const pw = (form[0] as HTMLInputElement).value;
          console.log(pw);

          try {
            const currentEmail = currentUser?.email as string;
            // ambil data user kemudian update email
            let user = auth.currentUser as User;

            // mengambil credential
            const credential = EmailAuthProvider.credential(currentEmail, pw);

            if (!user) {
              console.log("Re authenticate");
              const res = await signInWithEmailAndPassword(
                auth,
                currentEmail,
                pw
              );

              if (!res.user) {
                throw { error: "Password atau username salah!" };
              }
            }

            try {
              const res = await reauthenticateWithCredential(user, credential);

              // update email
              await updateEmail(res.user, email.value);

              // update document
              await updateUserDoc();

              setLoading(false);
            } catch (error) {
              throw error;
            }
          } catch (error) {
            console.log(error);
            toast.error("Password yang anda masukan salah!", {
              duration: 3500,
            });
          } finally {
            setLoading(false);
          }
        }

        toast(
          (t) => (
            <form className="my-2 w-72" onSubmit={handleSubmitToast} action="">
              <h1 className="font-bold text-amber-700 text-lg mb-2">
                Update Email?
              </h1>
              <FormInput
                id="password"
                placeholder="Enter Password"
                label="Tolong masukan password anda"
                type="password"
                required={true}
                className="mb-4 mt-0"
                focus={true}
              />
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-sky-600 text-white rounded-md px-4 py-2 font-semibold mr-4"
                type="submit"
              >
                Submit
              </button>
              <button
                className="bg-red-600 text-white rounded-md px-4 py-2 font-semibold"
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              >
                Close
              </button>
            </form>
          ),
          { duration: 2000 * 60 }
        );

        return false;
      }

      console.log("sampai akhir");
      // update dokumen user
      await updateUserDoc();
    } catch (error) {
      console.log(error);
      toast.error("Profile gagal di update!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster />
      <div className="w-full px-4 xl:px-0 sm:px-2 my-5 lg:w-3/4 md:w-full">
        <h1 className="text-2xl font-semibold text-amber-800 mb-6 md:mb-8">
          Edit Data {currentUser?.name}
        </h1>
        <form action="#" onSubmit={handleSubmit}>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2">
            <div className="sm:mr-2 md:mr-5">
              <FormInput
                id="name"
                placeholder="Full Name"
                required={true}
                label="Full Name"
                defaultValue={currentUser?.name}
                disabled={loading}
              />
              <FormInput
                id="username"
                placeholder="Enter Username"
                label="Username"
                required={true}
                defaultValue={currentUser?.username}
                disabled={loading}
              />
              <FormInput
                id="phone"
                placeholder="Enter Phone Number (08xxx)"
                label="Phone Number"
                defaultValue={currentUser?.phone}
                disabled={loading}
              />
            </div>
            <div className="sm:ml-2 md:ml-5">
              <FormInput
                id="email"
                placeholder="Enter Email"
                type="email"
                label="Email"
                required={true}
                defaultValue={currentUser?.email}
                disabled={loading}
              />
              <FormInput
                id="oldPassword"
                placeholder="Enter Old Password"
                type="password"
                label="Old Password"
                disabled={loading}
              />
              <FormInput
                id="newPassword"
                placeholder="Enter New Password"
                type="password"
                label="New Password"
                disabled={loading}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-14 text-center font-bold bg-amber-700 hover:bg-amber-600 rounded-xl px-10 py-3 text-amber-50 tracking-widest"
          >
            {loading ? "Please Wait..." : "Update Data"}
          </button>
        </form>
      </div>
    </>
  );
}
