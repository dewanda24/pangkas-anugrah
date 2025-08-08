"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  FaUser,
  FaDollarSign,
  FaChild,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

function getDateRange(filter: "hari" | "bulan" | "tahun") {
  const today = new Date();

  let startDate = "";
  let endDate = "";

  if (filter === "hari") {
    startDate = today.toISOString().slice(0, 10);
    endDate = startDate;
  } else if (filter === "bulan") {
    startDate = today.toISOString().slice(0, 7) + "-01";
    const endDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    endDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${endDay.toString().padStart(2, "0")}`;
  } else if (filter === "tahun") {
    startDate = `${today.getFullYear()}-01-01`;
    endDate = `${today.getFullYear()}-12-31`;
  }

  return { startDate, endDate };
}

export default function DashboardPage() {
  const supabase = createClientComponentClient();

  const [filter, setFilter] = useState<"hari" | "bulan" | "tahun">("hari");

  const [visitors, setVisitors] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [adultCount, setAdultCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      const { startDate, endDate } = getDateRange(filter);

      try {
        // Pengunjung (total count)
        const { data: visitorsData, error: visitorsError } = await supabase
          .from("pelanggan")
          .select("id", { count: "exact" })
          .gte("tanggal", startDate)
          .lte("tanggal", endDate);

        if (visitorsError) throw visitorsError;
        setVisitors(visitorsData?.length || 0);

        // Total pendapatan
        const { data: revenueData, error: revenueError } = await supabase
          .from("pelanggan")
          .select("harga")
          .gte("tanggal", startDate)
          .lte("tanggal", endDate);

        if (revenueError) throw revenueError;
        const revenueTotal = revenueData?.reduce(
          (sum, item) => sum + (item.harga || 0),
          0
        );
        setTotalRevenue(revenueTotal || 0);

        // Jumlah anak
        const { data: childrenData, error: childrenError } = await supabase
          .from("pelanggan")
          .select("id", { count: "exact" })
          .eq("jenis", "Anak-anak")
          .gte("tanggal", startDate)
          .lte("tanggal", endDate);

        if (childrenError) throw childrenError;
        setChildrenCount(childrenData?.length || 0);

        // Jumlah dewasa
        const { data: adultData, error: adultError } = await supabase
          .from("pelanggan")
          .select("id", { count: "exact" })
          .eq("jenis", "Dewasa")
          .gte("tanggal", startDate)
          .lte("tanggal", endDate);

        if (adultError) throw adultError;
        setAdultCount(adultData?.length || 0);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal mengambil data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filter, supabase]);

  if (loading) return <p>Memuat data dashboard...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4">
      {/* Filter */}
      <div className="mb-6 flex items-center gap-4">
        <FaCalendarAlt className="text-gray-600 text-xl" />
        <label htmlFor="filter" className="font-semibold">
          Filter Data:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "hari" | "bulan" | "tahun")
          }
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="hari">Hari Ini</option>
          <option value="bulan">Bulan Ini</option>
          <option value="tahun">Tahun Ini</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white dark:bg-gray-900 p-4 rounded shadow flex items-center gap-4">
          <FaUser className="text-blue-600 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Pengunjung</h3>
            <p className="text-2xl">{visitors}</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900  p-4 rounded shadow flex items-center gap-4">
          <FaDollarSign className="text-green-600 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Pendapatan</h3>
            <p className="text-2xl">Rp {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900  p-4 rounded shadow flex items-center gap-4">
          <FaChild className="text-yellow-600 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Jumlah Anak</h3>
            <p className="text-2xl">{childrenCount}</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900  p-4 rounded shadow flex items-center gap-4">
          <FaUsers className="text-purple-600 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Jumlah Dewasa</h3>
            <p className="text-2xl">{adultCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
