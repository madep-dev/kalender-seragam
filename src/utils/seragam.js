// 🔧 Tambahin function ini di atas atau bawah
export function getWeekOfMonth(date) {
    const startOfMonth = date.startOf("month");
    const offset = startOfMonth.day(); // 0 = Minggu, 1 = Senin, dst
    return Math.floor((date.date() + offset - 1) / 7) + 1;
}

export function getSeragamByDate(date) {
    const namaHari = date.format("dddd");
    const mingguKe = getWeekOfMonth(date);

    // Prioritas 2: Aturan spesial
    const tanggal = date.date();

    if (namaHari === "Minggu") {
        return { seragam: "", warna: "" };
    }

    if (namaHari === "Sabtu") {
        return { seragam: "", warna: "border-stone-500" };
    }

    if (tanggal === 17) {
        return { seragam: "KORPRI", warna: "border-stone-500" };
    }

    if (tanggal === 18) {
        return { seragam: "Baju Adat Brebesan", warna: "border-stone-500" };
    }

    if (namaHari === "Senin" || namaHari === "Selasa") {
        return { seragam: "Khaki", warna: "border-stone-500" };
    }

    if (namaHari === "Rabu") {
        return { seragam: "PDH Putih", warna: "border-stone-500" };
    }

    if (namaHari === "Kamis") {
        if (mingguKe === 1) {
            return { seragam: "Batik Sidomukti Ukel", warna: "border-stone-500" };
        } else {
            return { seragam: "Batik Brebes Lainnya", warna: "border-stone-500" };
        }
    }

    if (namaHari === "Jumat") {
        return { seragam: "Batik Brebes/Nasional/Lurik", warna: "border-stone-500" };
    }
}
