"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function InputPelangganPage() {
  const supabase = createClientComponentClient();

  // State
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [jenis, setJenis] = useState("");
  const [harga, setHarga] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set tanggal & jam ke waktu sekarang pas pertama render
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    setTanggal(`${yyyy}-${mm}-${dd}`);
    setJam(`${hh}:${min}`);
  }, []);

  // Update harga otomatis saat jenis berubah
  useEffect(() => {
    if (jenis === "Anak-anak") setHarga(18000);
    else if (jenis === "Dewasa") setHarga(20000);
    else setHarga(0);
  }, [jenis]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!jenis) {
      setError("Pilih jenis pelanggan");
      setLoading(false);
      return;
    }

    if (harga <= 0) {
      setError("Harga tidak valid");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("pelanggan").insert([
      {
        tanggal,
        jam,
        jenis,
        harga,
      },
    ]);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    alert("Berhasil simpan!");
    // Form tetap di halaman, input bisa diubah ulang
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Input Data Pelanggan
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Jam
          </label>
          <input
            type="time"
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Jenis
          </label>
          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Pilih Jenis</option>
            <option value="Anak-anak">Anak-anak</option>
            <option value="Dewasa">Dewasa</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Harga
          </label>
          <input
            type="number"
            value={harga}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
