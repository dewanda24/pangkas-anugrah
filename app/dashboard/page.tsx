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

type FilterType = "hari" | "bulan" | "tahun" | "custom";

function getDateRange(
  filter: FilterType,
  customStart?: string,
  customEnd?: string
) {
  const today = new Date();

  if (filter === "hari") {
    const startDate = today.toISOString().slice(0, 10); // format YYYY-MM-DD
    return { startDate, endDate: startDate };
  } else if (filter === "bulan") {
    const startDate = today.toISOString().slice(0, 7) + "-01";
    const endDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const endDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${endDay.toString().padStart(2, "0")}`;
    return { startDate, endDate };
  } else if (filter === "tahun") {
    const startDate = `${today.getFullYear()}-01-01`;
    const endDate = `${today.getFullYear()}-12-31`;
    return { startDate, endDate };
  } else if (filter === "custom" && customStart && customEnd) {
    return { startDate: customStart, endDate: customEnd };
  }

  // fallback hari ini
  const startDate = today.toISOString().slice(0, 10);
  return { startDate, endDate: startDate };
}

export default function DashboardPage() {
  const supabase = createClientComponentClient();

  const [filter, setFilter] = useState<FilterType>("hari");

  // Untuk input tanggal custom
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

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

      // Tentukan tanggal sesuai filter
      const { startDate, endDate } = getDateRange(
        filter,
        customStartDate,
        customEndDate
      );

      try {
        // Pengunjung (total count)
        const { count: visitorsCount, error: visitorsError } = await supabase
          .from("pelanggan")
          .select("id", { count: "exact", head: true })
          .gte("tanggal", startDate)
          .lte("tanggal", endDate);

        if (visitorsError) throw visitorsError;
        setVisitors(visitorsCount ?? 0);

        // Total pendapatan (sum harga)
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
        const { count: childrenCount, error: childrenError } = await supabase
          .from("pelanggan")
          .select("id", { count: "exact", head: true })
          .eq("jenis", "Anak-anak")
          .gte("tanggal", startDate)
          .lte("tanggal", endDate);

        if (childrenError) throw childrenError;
        setChildrenCount(childrenCount ?? 0);

        // Jumlah dewasa
        const { count: adultCount, error: adultError } = await supabase
          .from("pelanggan")
          .select("id", { count: "exact", head: true })
          .eq("jenis", "Dewasa")
          .gte("tanggal", startDate)
          .lte("tanggal", endDate);

        if (adultError) throw adultError;
        setAdultCount(adultCount ?? 0);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal mengambil data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // Jika filter custom, pastikan tanggal mulai & akhir valid dulu sebelum fetch
    if (filter === "custom") {
      if (customStartDate && customEndDate) {
        fetchDashboardData();
      } else {
        // Kalau tanggal belum lengkap, reset data ke 0
        setVisitors(0);
        setTotalRevenue(0);
        setChildrenCount(0);
        setAdultCount(0);
        setLoading(false);
      }
    } else {
      fetchDashboardData();
    }
  }, [filter, customStartDate, customEndDate, supabase]);

  if (loading) return <p>Memuat data dashboard...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4">
      {/* Filter */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 ">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-600 text-xl" />
          <label htmlFor="filter" className="font-semibold">
            Filter Data:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="border border-gray-300 rounded px-2 py-1 bg-gray-900"
          >
            <option value="hari">Hari Ini</option>
            <option value="bulan">Bulan Ini</option>
            <option value="tahun">Tahun Ini</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {filter === "custom" && (
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="font-semibold">
              Dari:
            </label>
            <input
              type="date"
              id="startDate"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              max={customEndDate || undefined}
            />

            <label htmlFor="endDate" className="font-semibold">
              Sampai:
            </label>
            <input
              type="date"
              id="endDate"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              min={customStartDate || undefined}
            />
          </div>
        )}
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

        <div className="card bg-white dark:bg-gray-900 p-4 rounded shadow flex items-center gap-4">
          <FaDollarSign className="text-green-600 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Pendapatan</h3>
            <p className="text-2xl">Rp {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 p-4 rounded shadow flex items-center gap-4">
          <FaChild className="text-yellow-600 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Jumlah Anak</h3>
            <p className="text-2xl">{childrenCount}</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 p-4 rounded shadow flex items-center gap-4">
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
