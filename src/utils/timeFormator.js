// Fungsi untuk mengubah tanggal dan waktu menjadi Unix time
export function toUnixTime(date, time) {
  const dateTimeString = `${date}T${time}:00`; // Format: 'YYYY-MM-DDTHH:mm:ss'
  return Math.floor(new Date(dateTimeString).getTime() / 1000);
}

// Fungsi untuk mengubah Unix time menjadi format tanggal dan waktu
export function fromUnixTime(unixTime) {
  const date = new Date(unixTime * 1000); // Convert to milliseconds

  // Format tanggal: YYYY-MM-DD
  const formattedDate = date.toISOString().split("T")[0];

  // Format waktu: HH:mm
  const formattedTime = date.toTimeString().slice(0, 5);

  return { date: formattedDate, time: formattedTime };
}
