"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CardStat from "@/components/CardStat";
import { FiUsers, FiDollarSign } from "react-icons/fi";
import { FaChild, FaUserTie } from "react-icons/fa";

export default function Dashboard() {
  const [totalPengunjung, setTotalPengunjung] = useState(0);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [jumlahDewasa, setJumlahDewasa] = useState(0);

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState<Date>(firstDay);
  const [endDate, setEndDate] = useState<Date>(today);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("pengunjung")
        .select("harga, jenis, tanggal")
        .gte("tanggal", startDate.toISOString())
        .lte("tanggal", endDate.toISOString());

      if (error) {
        console.error("Gagal fetch:", error.message);
        return;
      }

      const jumlah = data?.length || 0;
      const total =
        data?.reduce((acc, curr) => acc + (curr.harga || 0), 0) || 0;
      const anak = data?.filter((d) => d.jenis === "Anak-anak").length || 0;
      const dewasa = data?.filter((d) => d.jenis === "Dewasa").length || 0;

      setTotalPengunjung(jumlah);
      setTotalPendapatan(total);
      setJumlahAnak(anak);
      setJumlahDewasa(dewasa);
    };

    fetchStats();
  }, [startDate, endDate]);

  return (
    <section className="p-4 max-w-5xl mx-auto">
      {/* Filter Tanggal */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-700">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="border rounded px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-700">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="border rounded px-3 py-2 text-gray-900"
          />
        </div>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardStat
          title="Total Pengunjung"
          value={totalPengunjung}
          icon={<FiUsers />}
        />
        <CardStat
          title="Total Pendapatan"
          value={`Rp ${totalPendapatan.toLocaleString()}`}
          icon={<FiDollarSign />}
        />
        <CardStat title="Anak-anak" value={jumlahAnak} icon={<FaChild />} />
        <CardStat title="Dewasa" value={jumlahDewasa} icon={<FaUserTie />} />
      </div>
    </section>
  );
}
