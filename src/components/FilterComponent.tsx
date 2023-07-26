import { Close } from "@icon-park/react";
import { useRef, useState } from "react";

type FilterComponentProps = {
  filterTextFrom: string;
  filterTextTo: string;
  onFilterFrom: (value: string) => void;
  onFilterTo: (value: string) => void;
  onClear: () => void;
};

export default function FilterComponent({
  filterTextFrom,
  filterTextTo,
  onFilterFrom,
  onFilterTo,
  onClear,
}: FilterComponentProps) {
  const [focus, setFocus] = useState<boolean>(false);
  const dateFromRef = useRef<HTMLInputElement>(null);
  const dateToRef = useRef<HTMLInputElement>(null);

  function openDateFromPicker() {
    if (dateFromRef.current) {
      dateFromRef.current.showPicker();
    }
  }

  function openDateToPicker() {
    if (dateToRef.current) {
      dateToRef.current.showPicker();
    }
  }

  return (
    <div className={`mb-5 rounded-lg flex gap-2`}>
      <label
        className={`px-2 w-32 text-left border-2 border-emerald-300 py-2 relative rounded-lg text-gray-500 outline-none`}
        htmlFor="FilterInputFrom"
        onClick={openDateFromPicker}
      >
        {filterTextFrom ? filterTextFrom : "From Date"}

        <input
          className="absolute w-0 h-0 top-0 left-0"
          type="date"
          id="FilterInputFrom"
          ref={dateFromRef}
          placeholder="from Date"
          value={filterTextFrom}
          onChange={(e) => onFilterFrom(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </label>
      <label
        className={`px-2 w-32 text-left border-2 border-emerald-300 py-2 relative rounded-lg text-gray-500 outline-none`}
        htmlFor="FilterInputTo"
        onClick={openDateToPicker}
      >
        {filterTextTo ? filterTextTo : "To Date"}

        <input
          className="absolute w-0 h-0 top-0 left-0"
          type="date"
          id="FilterInputTo"
          ref={dateToRef}
          placeholder="To Date"
          value={filterTextTo}
          onChange={(e) => onFilterTo(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </label>
      <button
        className={`${
          focus
            ? "bg-emerald-500 border-emerald-500"
            : "bg-emerald-300 border-emerald-300"
        } rounded-lg border-2 hover:border-emerald-600 hover:bg-emerald-600 right-0 inline-block px-2 py-1 aspect-square font-semibold uppercase text-white`}
        onClick={onClear}
      >
        <Close size={20} />
      </button>
    </div>
  );
}
