"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FaEdit, FaTrash } from "react-icons/fa";

type Pelanggan = {
  id: string;
  tanggal: string;
  jam: string;
  jenis: string;
  harga: number;
  created_at?: string;
};

export default function PelangganPage() {
  const supabase = createClientComponentClient();
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Pelanggan | null>(null);
  const [saving, setSaving] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  // Filter
  const [filterTahun, setFilterTahun] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [filterHari, setFilterHari] = useState("");

  const fetchPelanggan = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pelanggan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setPelanggan(data || []);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPelanggan();
  }, [fetchPelanggan]);

  // Reset page tiap filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filterTahun, filterBulan, filterHari]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    const { error } = await supabase.from("pelanggan").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchPelanggan();
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from("pelanggan")
      .update({
        tanggal: selected.tanggal,
        jam: selected.jam,
        jenis: selected.jenis,
        harga: selected.harga,
      })
      .eq("id", selected.id);
    setSaving(false);
    if (error) alert(error.message);
    else {
      setSelected(null);
      fetchPelanggan();
    }
  };

  // Filter data
  const filteredData = pelanggan.filter((p) => {
    const tgl = new Date(p.tanggal);
    const tahunMatch = filterTahun
      ? tgl.getFullYear().toString() === filterTahun
      : true;
    const bulanMatch = filterBulan
      ? (tgl.getMonth() + 1).toString().padStart(2, "0") === filterBulan
      : true;
    const hariMatch = filterHari
      ? tgl.getDate().toString().padStart(2, "0") === filterHari
      : true;
    return tahunMatch && bulanMatch && hariMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / dataPerPage);
  const indexOfLast = currentPage * dataPerPage;
  const indexOfFirst = indexOfLast - dataPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-4 space-y-5 min-h-screen transition-colors duration-500">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Data Pelanggan
      </h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-5 text-sm">
        <select
          value={filterTahun}
          onChange={(e) => setFilterTahun(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Semua Tahun</option>
          {[
            ...new Set(pelanggan.map((p) => new Date(p.tanggal).getFullYear())),
          ].map((tahun) => (
            <option key={tahun} value={tahun}>
              {tahun}
            </option>
          ))}
        </select>

        <select
          value={filterBulan}
          onChange={(e) => setFilterBulan(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Semua Bulan</option>
          {[...Array(12)].map((_, i) => {
            const bulan = (i + 1).toString().padStart(2, "0");
            return (
              <option key={bulan} value={bulan}>
                {bulan}
              </option>
            );
          })}
        </select>

        <select
          value={filterHari}
          onChange={(e) => setFilterHari(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Semua Hari</option>
          {[...Array(31)].map((_, i) => {
            const hari = (i + 1).toString().padStart(2, "0");
            return (
              <option key={hari} value={hari}>
                {hari}
              </option>
            );
          })}
        </select>
      </div>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Memuat data...
        </p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
        <table className="w-full text-gray-900 dark:text-gray-100 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-left font-semibold uppercase tracking-wider">
                No
              </th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-left font-semibold uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-left font-semibold uppercase tracking-wider">
                Jam
              </th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-left font-semibold uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-left font-semibold uppercase tracking-wider">
                Harga
              </th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-left font-semibold uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((p, index) => (
              <tr
                key={p.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-center font-medium">
                  {indexOfFirst + index + 1}
                </td>
                <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                  {p.tanggal}
                </td>
                <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                  {p.jam}
                </td>
                <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 capitalize">
                  {p.jenis}
                </td>
                <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                  Rp {p.harga.toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 flex gap-2">
                  <button
                    onClick={() => setSelected(p)}
                    className="p-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
                    aria-label="Edit"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    aria-label="Hapus"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="overflow-x-auto w-full mt-5 mb-12 md:mb-0">
          <div className="inline-flex gap-1 justify-center min-w-max px-2 items-center">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded font-semibold shadow-md text-sm bg-gray-50 text-indigo-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded font-semibold shadow-md transition duration-300 text-sm whitespace-nowrap ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
                aria-label={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded font-semibold shadow-md text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-5 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-300">
              Edit Data Pelanggan
            </h2>
            <form onSubmit={handleEdit} className="space-y-3 text-sm">
              <input
                type="date"
                value={selected.tanggal}
                onChange={(e) =>
                  setSelected({ ...selected, tanggal: e.target.value })
                }
                className="w-full border border-indigo-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-indigo-600 dark:text-gray-100"
              />
              <input
                type="time"
                value={selected.jam}
                onChange={(e) =>
                  setSelected({ ...selected, jam: e.target.value })
                }
                className="w-full border border-indigo-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-indigo-600 dark:text-gray-100"
              />
              <input
                type="text"
                value={selected.jenis}
                onChange={(e) =>
                  setSelected({ ...selected, jenis: e.target.value })
                }
                placeholder="Jenis"
                className="w-full border border-indigo-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-indigo-600 dark:text-gray-100"
              />
              <input
                type="number"
                value={selected.harga}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    harga: parseInt(e.target.value, 10) || 0,
                  })
                }
                placeholder="Harga"
                className="w-full border border-indigo-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-indigo-600 dark:text-gray-100"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-1 rounded-lg bg-gray-300 hover:bg-gray-400 transition duration-300 font-semibold dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
