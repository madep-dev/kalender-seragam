import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { getSeragamByDate } from "../utils/seragam";
import "dayjs/locale/id";
import ClipLoader from "react-spinners/ClipLoader";
dayjs.locale("id");

function CalendarSeragam() {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [hariLibur, setHariLibur] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState(null); // 🔍 Untuk modal info
    const [loading, setLoading] = useState(true);
    const hariMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const today = dayjs();

    useEffect(() => {
        const fetchHariLibur = async () => {
            const month = currentMonth.month() + 1;
            const year = currentMonth.year();

            setLoading(true); // mulai loading
            try {
                const { data } = await axios.get(`https://dayoffapi.vercel.app/api?month=${month}&year=${year}`);
                setHariLibur(data);
            } catch (error) {
                console.error("Gagal ambil data hari libur:", error);
            } finally {
                setLoading(false); // selesai loading
            }
        };

        fetchHariLibur();
    }, [currentMonth]);

    // 🔒 Lock scroll saat modal aktif
    useEffect(() => {
        document.body.style.overflow = selectedInfo ? "hidden" : "auto";
    }, [selectedInfo]);

    const checkLibur = (date) => {
        const tanggalStr = date.format("YYYY-MM-D");
        const namaHari = hariMap[date.day()];
        const liburData = hariLibur.find((item) => item.tanggal === tanggalStr);
        return {
            isLibur: Boolean(liburData) || namaHari === "Minggu" || namaHari === "Sabtu",
            liburInfo: liburData?.keterangan || (namaHari === "Minggu" ? "" : namaHari === "Sabtu" ? "" : null),
        };
    };

    const { seragam: seragamHariIni } = getSeragamByDate(today);
    const { isLibur: isHariIniLibur, liburInfo: liburHariIniInfo } = checkLibur(today);

    const monthStart = currentMonth.startOf("month");
    const startDay = monthStart.day();
    const daysInMonth = monthStart.daysInMonth();

    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = monthStart.date(i + 1);
        const tanggalStr = date.format("YYYY-MM-D");
        const { seragam, warna } = getSeragamByDate(date);
        const { isLibur, liburInfo } = checkLibur(date);
        const isToday = date.isSame(today, "day");
        const highlightToday = isToday ? "bg-yellow-200 font-bold" : "";

        return {
            tanggal: date.date(),
            fullDate: tanggalStr,
            seragam,
            warna: isLibur ? "text-red-500 border border-red-500" : warna,
            libur: liburInfo,
            highlight: highlightToday,
        };
    });

    return (
        <>
            <div className="max-w-4xl mx-auto p-2 sm:p-6">
                <h1 className="text-xl mt-3 sm:text-3xl font-extrabold text-center text-stone-700 tracking-wide mb-1">
                    Kalender Seragam bulan {monthStart.format("MMMM YYYY")}
                </h1>
                <p className="text-sm sm:text-normal text-center text-stone-500 mb-6 leading-4">
                    Berdasarkan SE Bupati Brebes Nomor 000.8.3/1301/X/2024 tentang Pakaian Dinas ASN di Lingkungan Pemerintah Kabupaten
                    Brebes
                </p>

                {/* 🟢 Info Hari Ini */}
                <div className="mb-8 text-center border bg-yellow-100 border-yellow-300 py-4 rounded-lg">
                    <h2 className="text-normal text-stone-700 sm:text-xl font-semibold">{today.format("dddd, D MMMM YYYY")}</h2>
                    {!isHariIniLibur ? (
                        <p className="text-stone-700 text-sm sm:text-[1em]">
                            Hari ini memakai <span className="text-sky-500 font-semibold">{seragamHariIni}</span>
                        </p>
                    ) : (
                        <p className="text-red-500 italic">Hari Libur {"- " + liburHariIniInfo}</p>
                    )}
                </div>

                {/* 🔄 Navigasi */}
                <div className="flex flex-row justify-between sm:justify-center gap-2 sm:gap-4 mb-4">
                    <button
                        onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
                        className="text-xs sm:text-sm text-stone-600 bg-stone-50 border border-stone-300 hover:bg-stone-200 px-4 py-2 rounded-full transition-all duration-200">
                        ⬅️ Bulan Sebelumnya
                    </button>
                    <button
                        onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}
                        className="text-xs sm:text-sm text-stone-600 bg-stone-50 border border-stone-300 hover:bg-stone-200 px-4 py-2 rounded-full transition-all duration-200">
                        Bulan Berikutnya ➡️
                    </button>
                </div>

                {/* 📅 Kalender */}
                <div className="p-2 sm:p-5 bg-white border border-stone-400 rounded-lg">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <ClipLoader size={40} color={"#3B82F6"} loading={loading} />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-3">
                                {hariMap.map((hari) => (
                                    <div
                                        key={hari}
                                        className={`font-semibold text-[0.8em] sm:text-lg ${
                                            hari === "Minggu" ? "text-red-500" : "text-stone-800"
                                        }`}>
                                        {hari}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {Array(startDay)
                                    .fill(null)
                                    .map((_, i) => (
                                        <div key={`empty-${i}`} className="h-16 sm:h-28" />
                                    ))}

                                {calendarDays.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`p-1 h-16 sm:h-28 text-xs sm:text-sm rounded-md border flex flex-col justify-between ${day.warna} ${day.highlight}`}>
                                        <span className="text-lg text-center sm:text-end sm:text-3xl">{day.tanggal}</span>

                                        {/* ✅ Desktop Langsung Tampil */}
                                        {!day.libur && day.seragam && (
                                            <>
                                                <span
                                                    className="hidden sm:block text-[0.8em] text-center truncate border border-sky-300 bg-sky-100 text-sky-600 px-2 py-0.5 rounded-md"
                                                    title={day.seragam}>
                                                    {day.seragam}
                                                </span>

                                                <button
                                                    onClick={() => setSelectedInfo(day.seragam)}
                                                    className="block sm:hidden text-blue-500 text-xs"
                                                    title="Lihat seragam">
                                                    ℹ️
                                                </button>
                                            </>
                                        )}

                                        {day.libur && (
                                            <>
                                                <span
                                                    className="hidden sm:block text-[0.8em] text-center truncate border border-red-200 bg-red-100 text-red-600 px-2 py-0.5 rounded-md"
                                                    title={day.libur}>
                                                    {day.libur}
                                                </span>
                                                <button
                                                    onClick={() => setSelectedInfo(day.libur)}
                                                    className="block sm:hidden text-blue-500 text-xs"
                                                    title="Lihat info libur">
                                                    ℹ️
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 text-stone-700 text-[0.8em] sm:text-[0.9em]">
                    <p>Catatan :</p>
                    <p>Kalender ini hanya berlaku untuk Perangkat Daerah yang menerapkan 5 hari kerja.</p>
                </div>

                {/* 🧠 Modal Info (Mobile) */}
                {selectedInfo && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setSelectedInfo(null)}>
                        <div
                            className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-[90%] text-center animate-fadeIn"
                            onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-lg font-bold mb-2">Info</h2>
                            <p className="text-sm">{selectedInfo}</p>
                            <button onClick={() => setSelectedInfo(null)} className="mt-4 px-4 py-1 bg-blue-500 text-white rounded">
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <p className="text-[0.8em] sm:text-[0.9em] text-center mt-10 py-3 text-stone-700">
                    Created with ❤️ by
                    <a
                        href="https://t.me/vickerz16"
                        className="ms-1 text-blue-500 transition-all duration-200 hover:underline hover:text-red-500"
                        target="_blank">
                        me.
                    </a>
                </p>
            </div>
        </>
    );
}

export default CalendarSeragam;
