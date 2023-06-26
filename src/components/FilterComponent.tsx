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

  function openDatePicker() {
    if (ref.current) {
      ref.current.showPicker();
    }
  }

  return (
    <div
      className={`mb-5 border-2 rounded-lg flex ${
        focus ? "border-emerald-500" : "border-emerald-100"
      }`}
    >
      <label
        className={`px-4 w-40 text-left py-2 relative rounded-lg text-gray-500 outline-none`}
        htmlFor="FilterInput"
        onClick={openDatePicker}
      >
        {filterText ? filterText : "Filter By Date"}

        <input
          className="absolute w-0 h-0 top-0 left-0"
          type="date"
          id="FilterInput"
          ref={ref}
          placeholder="Filter By Date"
          value={filterText}
          onChange={(e) => onFilter(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </label>
      <button
        className="bg-emerald-200 rounded-r-md border-2 hover:border-emerald-600 border-emerald-200 hover:bg-emerald-600 right-0 inline-block px-2 py-1 h-full aspect-square font-semibold uppercase text-white"
        onClick={onClear}
      >
        <Close size={20} />
      </button>
    </div>
  );
}
