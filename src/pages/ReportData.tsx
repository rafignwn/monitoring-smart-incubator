import FilterComponent from "../components/FilterComponent";
import { useContext, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { DHTContext } from "../contexts/DHTContext";

type TReportData = {
  id: string;
  hari: string;
  tanggal: string;
  waktu: string;
  suhu: string;
  kelembaban: string;
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

// main component
export default function ReportData() {
  const [filterTextFrom, setFilterTextFrom] = useState<string>("");
  const [filterTextTo, setFilterTextTo] = useState<string>("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    useState<boolean>(false);
  const [data, setData] = useState<Array<TReportData> | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<
    Array<TReportData> | undefined
  >([]);

  // omit kelembaban dan suhu
  const [omitSuhu, setOmitSuhu] = useState<boolean>(false);
  const [omitKelembaban, setOmitKelembaban] = useState<boolean>(false);

  // data suhu dan kelembaban
  const { temperatures, humiditis } = useContext(DHTContext);

  // action datatable untuk mengeksport data
  const actionMemo = useMemo(() => {
    let dataReport: any = filteredData;

    if (omitSuhu) {
      dataReport = filteredData?.map(({ suhu, ...newData }) => newData);
    }

    if (omitKelembaban) {
      dataReport = filteredData?.map(({ kelembaban, ...newData }) => newData);
    }

    return (
      <Export
        disabled={false}
        onExport={() =>
          downloadCSV(
            dataReport ? dataReport : [],
            `${filterTextFrom}-${filterTextTo}`
          )
        }
      />
    );
  }, [filteredData]);

  // mengambil data
  async function getData() {
    try {
      if (!data) {
        setLoading(true);
      }
      const res = await fetch("https://kelasf.000webhostapp.com/getDht.php");
      const res_data = await res.json();
      setData(res_data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // mengganti judul website
    document.title = "Rekap Data - Smart Inkubator";

    const dataInterval = setInterval(getData, 1000);

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  const handleClearFilter = () => {
    if (filterTextFrom || filterTextTo) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterTextFrom("");
      setFilterTextTo("");
    }
  };

  useEffect(() => {
    if (filterTextFrom && filterTextTo) {
      const newFilteredData = data?.filter(
        (item) =>
          item.tanggal.toLowerCase() >= filterTextFrom.toLowerCase() &&
          item.tanggal.toLowerCase() <= filterTextTo.toLowerCase()
      );

      setFilteredData(newFilteredData);
    } else {
      setFilteredData(data);
    }
    // console.log(data);
  }, [data]);

  return (
    <div className="p-5 md:px-5 px-0">
      <h1 className="my-5 text-2xl font-bold text-emerald-700">
        {loading && !data ? "Loading Data..." : "Halaman Rekap Data"}
      </h1>
      <div className="flex mb-3 gap-3 flex-wrap">
        <p className="bg-yellow-100 border border-yellow-300 pl-5 pr-1 py-2 rounded-md">
          <span className="text-yellow-600 font-semibold uppercase mr-3">
            Suhu :
          </span>
          <span className="font-semibold bg-white py-1 px-2 rounded-sm text-yellow-700">
            {temperatures[temperatures.length - 1]}°C
          </span>
        </p>
        <p className="bg-sky-100 border border-sky-300 pl-5 pr-1 py-2 rounded-md">
          <span className="text-sky-600 font-semibold uppercase mr-3">
            Kelembaban :{" "}
          </span>
          <span className="font-semibold bg-white py-1 px-2 rounded-sm text-sky-700">
            {humiditis[humiditis.length - 1]}Rh
          </span>
        </p>
      </div>
      <div className="mb-3">
        <button
          className="bg-yellow-500 text-sm text-white font-semibold uppercase px-4 py-1 rounded-md mr-3"
          onClick={() => setOmitKelembaban((prev) => !prev)}
        >
          {!omitKelembaban ? "Show Suhu" : "Clear"}
        </button>
        <button
          className="bg-sky-500 text-sm text-white font-semibold uppercase px-4 py-1 rounded-md mr-3"
          onClick={() => setOmitSuhu((prev) => !prev)}
        >
          {!omitSuhu ? "Show Kelembaban" : "Clear"}
        </button>
      </div>
      <DataTable
        title={
          <h4 className="mt-3 font-semibold text-xl text-emerald-600">
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
            omit: omitSuhu,
          },
          {
            name: "Kelembaban",
            omit: omitKelembaban,
            selector: (row) => `${row.kelembaban}Rh`,
          },
        ]}
        data={filteredData ? filteredData : []}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={
          <FilterComponent
            filterTextFrom={filterTextFrom}
            filterTextTo={filterTextTo}
            onFilterFrom={setFilterTextFrom}
            onFilterTo={setFilterTextTo}
            onClear={handleClearFilter}
          />
        }
        persistTableHead
        actions={actionMemo}
      />
    </div>
  );
}
