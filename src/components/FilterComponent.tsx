import { Close } from "@icon-park/react";
import { useRef, useState } from "react";

type FilterComponentProps = {
  filterText: string;
  onFilter: (value: string) => void;
  onClear: () => void;
};

export default function FilterComponent({
  filterText,
  onFilter,
  onClear,
}: FilterComponentProps) {
  const [focus, setFocus] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={`mb-5 border-2 rounded-lg flex`}>
      <input
        className={`px-4 py-1 rounded-lg bg-none outline-none ${
          focus ? "border-emerald-500" : "border-gray-300"
        }`}
        type="date"
        ref={ref}
        placeholder="Filter By Date"
        value={filterText}
        onChange={(e) => onFilter(e.target.value)}
        onFocus={() => {
          setFocus(true);
          if (ref.current) {
            ref.current.type = "date";
          }
        }}
        onBlur={() => {
          setFocus(false);
          if (ref.current) {
            ref.current.type = "text";
          }
        }}
      />
      <button
        className="bg-emerald-200 rounded-r-md border-2 hover:border-emerald-600 border-emerald-200 hover:bg-emerald-600 right-0 inline-block px-2 py-1 h-full aspect-square font-semibold uppercase text-white"
        onClick={onClear}
      >
        <Close size={20} />
      </button>
    </div>
  );
}
