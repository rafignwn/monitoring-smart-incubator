import { useEffect, useState } from "react";
import TableUser from "../components/TableUser";
import { onSnapshot, collection, query } from "firebase/firestore";
import { store } from "../firebase";
import { Toaster } from "react-hot-toast";
import { TUser } from "../contexts/AuthContext";

export default function UsersPage() {
  const [users, setUsers] = useState<Array<object | TUser>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Daftar Pengguna - Monitor Suhu";

    // menghubunkan ke kumpulan data users
    const unsub = onSnapshot(
      query(collection(store, "users")),
      (querySnapshoot) => {
        const data: Array<object> = [];
        querySnapshoot.forEach((doc) => {
          data.push({ uid: doc.id, ...doc.data() });
        });

        console.log(data);
        setUsers(data);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    // memutuskan hubungan dengan dokumen users
    // setelah meninggalkan komponen ini
    return () => unsub();
  }, []);

  return (
    <div className="w-full">
      <Toaster />
      <h1 className="text-2xl font-bold text-amber-800 mb-6 mt-2 md:mt-0 md:mb-8">
        Daftar Pengguna
      </h1>
      <div className="bg-white max-w-full w-fit overflow-auto rounded-xl p-5">
        {loading ? (
          <p className="text-xl text-amber-500 font-semibold tracking-wide">
            Sedang mengambil data...
          </p>
        ) : (
          <TableUser data={users} />
        )}
      </div>
    </div>
  );
}
