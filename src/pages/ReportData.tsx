import { Close } from "@icon-park/react";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";

type TReportData = {
  id: string;
  hari: string;
  tanggal: string;
  waktu: string;
  suhu: string;
  kelembaban: string;
};

type FilterComponentProps = {
  filterText: string;
  onFilter: (value: string) => void;
  onClear: () => void;
};

interface IndexSignature {
  [key: string]: any;
}

function convertArrayOfObjectsToCSV<TReportData extends IndexSignature>(
  array: Array<TReportData>
) {
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);
  let result = "";

  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;
      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

function downloadCSV(array: Array<TReportData>, title: string) {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename = `export_${title ? title : Date.now()}.csv`;

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", filename);
  link.click();
}

function Export({
  onExport,
  disabled,
}: {
  onExport: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <button
      className="bg-emerald-200 text-emerald-700 mr-2 px-4 text-base uppercase py-1 my-2 font-semibold rounded-md"
      disabled={disabled}
      onClick={(e) => onExport(e.currentTarget.value)}
    >
      Laporan
    </button>
  );
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filterText,
  onFilter,
  onClear,
}) => {
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <div
      className={`mb-5 border-2 rounded-lg relative pr-4 ${
        focus ? "border-emerald-500" : "border-emerald-200"
      }`}
    >
      <input
        className="px-4 py-1 rounded-lg outline-none"
        type="text"
        placeholder="Filter By Date and Day"
        value={filterText}
        onChange={(e) => onFilter(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <button
        className="bg-emerald-200 rounded-r-md border-2 hover:border-emerald-600 border-emerald-200 hover:bg-emerald-600 right-0 inline-block px-2 absolute py-1 h-full aspect-square font-semibold uppercase text-white"
        onClick={onClear}
      >
        <Close size={20} />
      </button>
    </div>
  );
};

// main component
export default function ReportData() {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState<Array<TReportData> | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<
    Array<TReportData> | undefined
  >([]);

  // action datatable untuk mengeksport data
  const actionMemo = useMemo(
    () => (
      <Export
        disabled={false}
        onExport={() =>
          downloadCSV(filteredData ? filteredData : [], filterText)
        }
      />
    ),
    [filteredData]
  );

  // mengambil data
  async function getData() {
    try {
      if (!data) {
        setLoading(true);
      }
      const res = await fetch(
        "https://rafignwn-api.000webhostapp.com/getDht.php"
      );
      const res_data = await res.json();
      console.log(res_data);
      setData(res_data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const dataInterval = setInterval(getData, 1000);

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  const handleClearFilter = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  useEffect(() => {
    const newFilteredData = data?.filter(
      (item) =>
        item.hari.toLowerCase().includes(filterText.toLowerCase()) ||
        item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
        item.waktu.toLowerCase().includes(filterText.toLowerCase())
    );

    setFilteredData(newFilteredData);
  }, [data]);

  return (
    <div className="p-5">
      <h1 className="my-5 text-2xl font-bold text-emerald-700">
        {loading && !data ? "Loading Data..." : "Halaman Rekap Data"}
      </h1>
      <DataTable
        title={
          <h4 className="font-semibold text-xl text-emerald-600">
            Data Suhu dan Kelembaban
          </h4>
        }
        columns={[
          {
            name: "Hari",
            selector: (row) => row.hari,
            sortable: true,
          },
          {
            name: "Tanggal",
            selector: (row) => row.tanggal,
            sortable: true,
          },
          {
            name: "Waktu",
            selector: (row) => row.waktu,
            sortable: true,
          },
          {
            name: "Suhu",
            selector: (row) => `${row.suhu}°C`,
          },
          {
            name: "Kelembaban",
            selector: (row) => `${row.kelembaban}%`,
          },
        ]}
        data={filteredData ? filteredData : []}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={
          <FilterComponent
            filterText={filterText}
            onFilter={setFilterText}
            onClear={handleClearFilter}
          />
        }
        persistTableHead
        actions={actionMemo}
      />
    </div>
  );
}
