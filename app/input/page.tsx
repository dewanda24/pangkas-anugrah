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
        value === "Anak-anak" ? "18000" : value === "Dewasa" ? "20000" : "";
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
    <section className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mt-6 space-y-6 ml-">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Input Pengunjung
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tanggal */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Jam */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jam
          </label>
          <input
            type="time"
            name="jam"
            value={form.jam}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Jenis Potongan */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jenis Potongan
          </label>
          <select
            name="jenis"
            value={form.jenis}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          >
            <option value="">-- Pilih Jenis --</option>
            <option value="Anak-anak">Anak-anak</option>
            <option value="Dewasa">Dewasa</option>
          </select>
        </div>

        {/* Harga */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Harga
          </label>
          <input
            type="number"
            name="harga"
            value={form.harga}
            readOnly
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
