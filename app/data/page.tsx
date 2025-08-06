"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Pengunjung {
  id: number;
  tanggal: string;
  jam: string;
  jenis: string;
  harga: number;
}

export default function DataPage() {
  const [data, setData] = useState<Pengunjung[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterJenis, setFilterJenis] = useState("semua");
  const [filterTanggal, setFilterTanggal] = useState("");

  const [editItem, setEditItem] = useState<Pengunjung | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("pengunjung")
      .select("*")
      .order("tanggal", { ascending: false })
      .order("jam", { ascending: false });

    if (filterJenis !== "semua") {
      query = query.ilike("jenis", filterJenis); // Gunakan ilike agar case-insensitive
    }

    if (filterTanggal) {
      query = query.eq("tanggal", filterTanggal);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Gagal mengambil data:", error.message);
    } else {
      setData(data as Pengunjung[]);
    }

    setLoading(false);
  }, [filterJenis, filterTanggal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Yakin mau menghapus data ini?");
    if (!confirm) return;

    const { error } = await supabase.from("pengunjung").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus data");
      console.error(error);
    } else {
      setData(data.filter((item) => item.id !== id));
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-700">
        Data Pengunjung
      </h2>

      {/* 🔍 Filter */}
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <select
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value.toLowerCase())}
          className="p-2 rounded border w-full md:w-auto text-gray-700"
        >
          <option value="semua">Semua Jenis</option>
          <option value="anak-anak">Anak-anak</option>
          <option value="dewasa">Dewasa</option>
        </select>

        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="p-2 rounded border w-full md:w-auto text-gray-700"
        />

        <button
          onClick={() => {
            setFilterJenis("semua");
            setFilterTanggal("");
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left border-b">Tanggal</th>
                <th className="px-4 py-3 text-left border-b">Jam</th>
                <th className="px-4 py-3 text-left border-b">Jenis</th>
                <th className="px-4 py-3 text-left border-b">Harga</th>
                <th className="px-4 py-3 text-left border-b">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.jam}</td>
                  <td className="px-4 py-3 capitalize">{item.jenis}</td>
                  <td className="px-4 py-3">
                    Rp {item.harga.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setShowModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit data"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Hapus data"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🛠 Modal Edit */}
          {showModal && editItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[90%] max-w-md">
                <h2 className="text-lg font-semibold mb-4">Edit Data</h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const form = e.target as HTMLFormElement;
                    const tanggal = form.tanggal.value;
                    const jam = form.jam.value;
                    const jenis = form.jenis.value.toLowerCase();
                    const harga = jenis === "anak-anak" ? 18000 : 20000;

                    const { error } = await supabase
                      .from("pengunjung")
                      .update({ tanggal, jam, jenis, harga })
                      .eq("id", editItem.id);

                    if (error) {
                      alert("Gagal update data");
                      console.error(error);
                    } else {
                      alert("Berhasil update");
                      setShowModal(false);
                      fetchData(); // Refresh data
                    }
                  }}
                >
                  <input
                    name="tanggal"
                    type="date"
                    defaultValue={editItem.tanggal}
                    className="w-full mb-3 p-2 rounded border"
                    required
                  />
                  <input
                    name="jam"
                    type="time"
                    defaultValue={editItem.jam}
                    className="w-full mb-3 p-2 rounded border"
                    required
                  />
                  <select
                    name="jenis"
                    defaultValue={editItem.jenis}
                    className="w-full mb-4 p-2 rounded border"
                    required
                  >
                    <option value="anak-anak">Anak-anak</option>
                    <option value="dewasa">Dewasa</option>
                  </select>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-400 rounded text-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 rounded text-white"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
