import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { getSeragamByDate } from "../utils/seragam";
import "dayjs/locale/id";
import ClipLoader from "react-spinners/ClipLoader";
import "remixicon/fonts/remixicon.css";
dayjs.locale("id");

function CalendarSeragam() {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [hariLibur, setHariLibur] = useState([]);
    const [hariLiburHariIni, setHariLiburHariIni] = useState([]); // 🆕 Tambahan
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const hariMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const today = dayjs();

    // Fetch data libur bulan yang sedang ditampilkan
    useEffect(() => {
        const fetchHariLibur = async () => {
            const month = currentMonth.month() + 1;
            const year = currentMonth.year();

            setLoading(true);
            try {
                const { data } = await axios.get(`https://dayoffapi.vercel.app/api?month=${month}&year=${year}`);
                setHariLibur(data);
            } catch (error) {
                console.error("Gagal ambil data hari libur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHariLibur();
    }, [currentMonth]);

    // 🆕 Fetch data libur bulan HARI INI (satu kali aja)
    useEffect(() => {
        const fetchHariLiburHariIni = async () => {
            const month = today.month() + 1;
            const year = today.year();

            try {
                const { data } = await axios.get(`https://dayoffapi.vercel.app/api?month=${month}&year=${year}`);
                setHariLiburHariIni(data);
            } catch (error) {
                console.error("Gagal ambil data libur hari ini:", error);
            }
        };

        fetchHariLiburHariIni();
    }, []);

    // Cek libur bulan yang sedang ditampilkan
    const checkLibur = (date) => {
        const tanggalStr = date.format("YYYY-MM-D");
        const namaHari = hariMap[date.day()];
        const liburData = hariLibur.find((item) => item.tanggal === tanggalStr);
        return {
            isLibur: Boolean(liburData) || namaHari === "Minggu",
            liburInfo: liburData?.keterangan || (namaHari === "Minggu" ? "" : namaHari === "Sabtu" ? "" : null),
        };
    };

    // 🆕 Cek libur HARI INI pakai data tetap
    const checkLiburHariIni = (date) => {
        const tanggalStr = date.format("YYYY-MM-D");
        const namaHari = hariMap[date.day()];
        const liburData = hariLiburHariIni.find((item) => item.tanggal === tanggalStr);
        return {
            isLibur: Boolean(liburData) || namaHari === "Minggu" || namaHari === "Sabtu",
            liburInfo: liburData?.keterangan || (namaHari === "Minggu" ? "" : namaHari === "Sabtu" ? "" : null),
        };
    };

    const { seragam: seragamHariIni } = getSeragamByDate(today);
    const { isLibur: isHariIniLibur, liburInfo: liburHariIniInfo } = checkLiburHariIni(today); // 🆕 Ganti ke checkLiburHariIni

    const monthStart = currentMonth.startOf("month");
    const startDay = monthStart.day();
    const daysInMonth = monthStart.daysInMonth();

    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = monthStart.date(i + 1);
        const tanggalStr = date.format("YYYY-MM-D");
        const { seragam, warna } = getSeragamByDate(date);
        const { isLibur, liburInfo } = checkLibur(date);
        const isToday = date.isSame(today, "day");
        const highlightToday = isToday ? "border-2 bg-yellow-200 font-bold" : "";

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
                <h1 className="text-xl mt-3 sm:text-3xl font-extrabold text-center text-sky-600 tracking-wide mb-1">
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
                        <p className="text-red-500 italic text-sm sm:text-[1em]">Hari Libur {"- " + liburHariIniInfo}</p>
                    )}
                </div>

                {/* 🔄 Navigasi */}
                <div className="flex flex-row justify-between sm:justify-center gap-2 sm:gap-4 mb-4">
                    <button
                        onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
                        className="text-xs sm:text-sm text-blue-500 bg-blue-50 hover:bg-blue-400 hover:text-white px-4 py-2 rounded-full transition-all duration-200">
                        <i className="ri-arrow-left-s-line"></i> Bulan Sebelumnya
                    </button>
                    <button
                        onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}
                        className="text-xs sm:text-sm text-blue-500 bg-blue-50 hover:bg-blue-400 hover:text-white px-4 py-2 rounded-full transition-all duration-200">
                        Bulan Berikutnya <i className="ri-arrow-right-s-line"></i>
                    </button>
                </div>

                {/* 📅 Kalender */}
                <div className="p-2 sm:p-5 bg-white border border-stone-500 rounded-lg">
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
                                                    className="hidden sm:block text-[0.8em] text-center truncate border border-sky-400 bg-sky-100 text-sky-600 px-2 py-0.5 rounded-md"
                                                    title={day.seragam}>
                                                    {day.seragam}
                                                </span>

                                                <button
                                                    onClick={() => setSelectedInfo(day.seragam)}
                                                    className="block sm:hidden text-blue-400 text-xs"
                                                    title="Lihat seragam">
                                                    <i className="ri-information-fill text-base"></i>
                                                </button>
                                            </>
                                        )}

                                        {day.libur && (
                                            <>
                                                <span
                                                    className="hidden sm:block text-[0.8em] text-center truncate border border-red-300 bg-red-100 text-red-600 px-2 py-0.5 rounded-md"
                                                    title={day.libur}>
                                                    {day.libur}
                                                </span>
                                                <button
                                                    onClick={() => setSelectedInfo(day.libur)}
                                                    className="block sm:hidden text-blue-400 text-xs"
                                                    title="Lihat info libur">
                                                    <i className="ri-information-fill text-base"></i>
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
                            className="bg-white rounded-xl shadow-2xl max-w-sm w-[90%] animate-fadeIn p-3"
                            onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-base text-stone-700 font-bold">Informasi</h2>
                            <p className="text-base text-stone-700 my-8 text-center">{selectedInfo}</p>
                            <div className="text-end">
                                <button
                                    onClick={() => setSelectedInfo(null)}
                                    className="px-5 py-1 bg-blue-50 text-blue-500 rounded-full text-sm active:bg-blue-400 active:text-white transition-all duration-200">
                                    <i className="ri-close-large-line me-1"></i>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-10">
                <p className="text-[0.8em] sm:text-[0.9em] text-center py-2 bg-blue-500 text-white">
                    Created with ❤️ by
                    <a
                        href="https://t.me/vickerz16"
                        className="ms-1 text-white transition-all duration-200 underline hover:text-red-500"
                        target="_blank">
                        me
                    </a>
                    .
                </p>
            </div>
        </>
    );
}

export default CalendarSeragam;
