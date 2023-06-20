import React from "react";

type FilterComponentProps = {
  filterText: string;
  onFilter: (value: string) => void;
  onClear: () => void;
};

const FilterComponent: React.FC<FilterComponentProps> = ({
  filterText,
  onFilter,
  onClear,
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Filter by Hari"
        value={filterText}
        onChange={(e) => onFilter(e.target.value)}
      />
      <button onClick={onClear}>Clear</button>
    </div>
  );
};

export default FilterComponent;
