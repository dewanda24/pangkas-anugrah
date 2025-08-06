"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DataItem {
  tanggal: string;
  jumlah: number;
}

export default function GrafikPage() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrafikData = async () => {
    const { data, error } = await supabase.from("pengunjung").select("tanggal");

    if (error) {
      console.error("Gagal mengambil data grafik:", error.message);
      setLoading(false);
      return;
    }

    // Kelompokkan data berdasarkan tanggal
    const grouped: Record<string, number> = {};

    data.forEach((item) => {
      const tgl = item.tanggal;
      grouped[tgl] = (grouped[tgl] || 0) + 1;
    });

    const chartData = Object.entries(grouped)
      .map(([tanggal, jumlah]) => ({ tanggal, jumlah }))
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    setData(chartData);
    setLoading(false);
  };

  useEffect(() => {
    fetchGrafikData();
  }, []);

  return (
    <section className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Grafik Pengunjung
      </h2>

      {loading ? (
        <p className="text-gray-500">Memuat grafik...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600">Belum ada data pengunjung.</p>
      ) : (
        <div className="w-full h-[400px] bg-white dark:bg-gray-900 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
