// Fungsi untuk mengubah tanggal dan waktu menjadi Unix time
export function toUnixTime(dateTime) {
  const localDate = new Date(dateTime); // 'datetime-local' menggunakan zona waktu lokal
  return Math.floor(localDate.getTime() / 1000); // Konversi ke detik
}

// Fungsi untuk mengubah Unix time menjadi format tanggal dan waktu
export const fromUnixTime = (unixTime) => {
  if (!unixTime) {
    return null;
  }
  const date = new Date(unixTime * 1000); // Konversi detik ke milidetik
  const offset = date.getTimezoneOffset() * 60000; // Perbedaan zona waktu dalam milidetik
  const localDate = new Date(date.getTime() - offset); // Sesuaikan ke waktu lokal

  return localDate.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:MM
};
