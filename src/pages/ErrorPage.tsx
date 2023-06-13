import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Error 404 - Monitor Suhu";
  }, []);

  return (
    <div className="bg-sky-50 w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-8xl text-yellow-400 font-bold text-center mb-10">
        Oops!
      </h1>
      <div className="border border-yellow-500 rounded-md border-solid overflow-hidden mb-5">
        <div className="w-full h-10 justify-end gap-2 px-2 flex items-center border-b border-yellow-500">
          <span className="w-5 h-5 border border-yellow-500 rounded-full" />
          <span className="w-5 h-5 border border-yellow-500 rounded-full" />
          <span className="w-5 h-5 border border-yellow-500 rounded-full" />
        </div>
        <div className="px-10 py-10">
          <h1 className="text-9xl text-yellow-500 font-thin text-center underline">
            404
          </h1>
        </div>
      </div>
      <h1 className="text-4xl text-yellow-600 font-bold text-center px-4">
        {`Page "${location.pathname.replace("/", "")}" Not Found`}
      </h1>
    </div>
  );
}
