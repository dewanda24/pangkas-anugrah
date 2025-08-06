"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function InputPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split("T")[0], // yyyy-mm-dd
    jam: new Date().toTimeString().slice(0, 5), // hh:mm
    jenis: "",
    harga: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Set harga otomatis berdasarkan jenis
    if (name === "jenis") {
      const harga =
        value === "anak-anak" ? "18000" : value === "dewasa" ? "20000" : "";
      setForm({ ...form, jenis: value, harga });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { tanggal, jam, jenis, harga } = form;

    const { error } = await supabase
      .from("pengunjung")
      .insert([{ tanggal, jam, jenis, harga: parseInt(harga) }]);

    setLoading(false);

    if (error) {
      setError("Gagal menyimpan data. Coba lagi.");
      console.error(error);
      return;
    }

    // Reset form
    setForm({
      tanggal: new Date().toISOString().split("T")[0],
      jam: new Date().toTimeString().slice(0, 5),
      jenis: "",
      harga: "",
    });

    alert("Data berhasil disimpan!");
    router.push("/");
  };

  return (
    <section className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mt-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Input Pengunjung
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Jam
          </label>
          <input
            type="time"
            name="jam"
            value={form.jam}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Jenis Potongan
          </label>
          <select
            name="jenis"
            value={form.jenis}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">-- Pilih Jenis --</option>
            <option value="Anak-anak">Anak-anak</option>
            <option value="Dewasa">Dewasa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Harga
          </label>
          <input
            type="number"
            name="harga"
            value={form.harga}
            readOnly
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
