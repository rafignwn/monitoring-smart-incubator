import { Delete, EditTwo } from "@icon-park/react";
import { deleteDoc, doc } from "firebase/firestore";
import { store } from "../firebase";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext, TUser } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ITableProps {
  data: Array<object | TUser>;
  className?: string;
}

interface ITableContent {
  children: string | number | JSX.Element;
  className?: string;
}

function DeleteButton({ id }: { id: string }) {
  const { currentUser } = useContext(AuthContext);

  async function deleteUser() {
    try {
      if (currentUser?.uid === id) {
        toast.error("Tidak bisa menghapus diri sendiri");
        return false;
      }

      await deleteDoc(doc(store, "users", id));
      toast.success("Data Berhasil dihapus.", {
        duration: 4500,
      });
    } catch (error) {
      console.log(error);
      toast.error("Data gagal dihapus!", { duration: 4500 });
    }
  }

  function handleDelete() {
    toast(
      (t) => (
        <div>
          <p className="mb-3">
            Apakah anda yakin ingin menghapus data user ini.?
          </p>
          <div>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                deleteUser();
              }}
              className="mr-3 border bg-sky-700 rounded-md font-semibold text-white px-3 py-1"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-red-600 px-3 py-1 rounded-md text-white font-semibold"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 60 * 1000 }
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-red-50 p-2 rounded-md mr-2"
    >
      <Delete size={20} />
    </button>
  );
}

export function TableDate({ children, className }: ITableContent) {
  return (
    <td
      className={`border border-amber-400 px-5 py-3 whitespace-nowrap ${className}`}
    >
      {children}
    </td>
  );
}

export function TableHead({ children, className }: ITableContent) {
  return (
    <th className={`border border-amber-400 px-8 py-2 ${className}`}>
      {children}
    </th>
  );
}

export default function TableUser({ data, className = "" }: ITableProps) {
  const navigation = useNavigate();

  return (
    <table className={className}>
      <thead>
        <tr className="border-collapse border">
          <TableHead className="px-3">Id</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Action</TableHead>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => {
          const user = item as TUser;

          return (
            <tr key={user.uid} className="border-collapse border">
              <TableDate className="px-3">{user.uid}</TableDate>
              <TableDate>{user.name}</TableDate>
              <TableDate>{user.username}</TableDate>
              <TableDate>{user.email}</TableDate>
              <TableDate>
                <>
                  <DeleteButton id={user.uid} />{" "}
                  {/* <button
                    onClick={() => navigation(`/edit/${user.uid}`)}
                    className="bg-sky-600 text-red-50 p-2 rounded-md mr-2"
                  >
                    <EditTwo size={20} />
                  </button> */}
                </>
              </TableDate>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
