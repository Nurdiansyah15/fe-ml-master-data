import React from "react";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function Sheet() {
  const data = [
    { Name: "John", Age: 30, City: "New York" },
    { Name: "Jane", Age: 25, City: "Los Angeles" },
  ];

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Data.xlsx");
  };

  const handleDownload2 = () => {
    // 1. Buat workbook dan worksheet kosong
    const workbook = XLSX.utils.book_new();
    const worksheet = {};

    // 2. Data yang akan dimasukkan (contoh)
    const dynamicData = [
      ["Name", "Age", "City"], // Header (Row 1)
      ["John", 30, "New York"], // Data 1 (Row 2)
      ["Jane", 25, "Los Angeles"], // Data 2 (Row 3)
    ];

    // 3. Masukkan data ke kolom (A+n) dan baris (1+n) dinamis
    dynamicData.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex + 1,
          c: colIndex + 2,
        });
        worksheet[cellAddress] = { v: value };
      });
    });

    // 4. Tentukan rentang sel (range) yang digunakan
    const range = XLSX.utils.decode_range("C2:E4"); // Sesuaikan dengan data
    worksheet["!ref"] = XLSX.utils.encode_range(range);

    // 5. Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 6. Simpan workbook sebagai file Excel
    XLSX.writeFile(workbook, "DynamicData.xlsx");
  };

  const handleDownload3 = () => {
    // 1. Membuat workbook dan worksheet baru
    const workbook = XLSX.utils.book_new();
    const worksheet = {};

    // 2. Menambahkan title dan header data
    worksheet["A1"] = { v: "Report Title" }; // Isi Title
    worksheet["A2"] = { v: "Name" }; // Header kolom pertama
    worksheet["B2"] = { v: "Age" }; // Header kolom kedua
    worksheet["C2"] = { v: "City" }; // Header kolom ketiga

    // 3. Data isi tabel (di bawah header)
    const tableData = [
      ["John", 30, "New York"],
      ["Jane", 25, "Los Angeles"],
    ];

    // 4. Menambahkan data ke worksheet
    tableData.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex + 2,
          c: colIndex,
        });
        worksheet[cellAddress] = { v: value };
      });
    });

    // 5. Menggabungkan cell A1 hingga C1 untuk title
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Merge A1:C1
    ];

    // 6. Menentukan rentang (range) worksheet
    worksheet["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: 4, c: 2 }, // Rentang hingga baris terakhir data
    });

    // 7. Tambahkan worksheet ke workbook dan simpan
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "ReportWithTitle.xlsx");
  };

  const handleDownload4 = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Styled Report");

    // 1. Menambahkan Title dengan Merge dan Styling
    worksheet.mergeCells("A1:C1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Report Title";
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // 2. Menambahkan Header dengan Styling
    const headerRow = worksheet.addRow(["Name", "Age", "City"]);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // 3. Menambahkan Data dengan Border
    const data = [
      ["John", 30, "New York"],
      ["Jane", 25, "Los Angeles"],
    ];

    data.forEach((row) => {
      const dataRow = worksheet.addRow(row);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // 4. Menyimpan File sebagai Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "StyledReport.xlsx");
  };

  const handleDownload5 = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dynamic Data");

    // 1. Offset untuk kolom dan baris (A + n dan 1 + n)
    const colOffset = 2; // Mulai di kolom C (A + 2)
    const rowOffset = 1; // Mulai di baris 2 (1 + 1)

    // 2. Data yang akan dimasukkan
    const data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Jane", age: 25, city: "Los Angeles" },
    ];

    // 3. Memasukkan header
    const headers = Object.keys(data[0]); // Mengambil kunci dari objek pertama sebagai header
    headers.forEach((header, index) => {
      const col = colOffset + index + 1; // Kolom mulai dari offset + index
      worksheet.getCell(rowOffset, col).value = header; // Menambahkan header ke worksheet
    });

    // 4. Memasukkan data ke posisi dinamis
    data.forEach((rowData, rowIndex) => {
      headers.forEach((header, colIndex) => {
        const row = rowOffset + rowIndex + 1; // Baris mulai dari offset + data index + 1 untuk header
        const col = colOffset + colIndex + 1; // Kolom mulai dari offset + index
        const cell = worksheet.getCell(row, col);
        cell.value = rowData[header]; // Mengisi cell dengan nilai dari objek

        // Styling untuk border setiap cell
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // 5. Menyimpan file sebagai Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "DynamicPosition.xlsx");
  };

  const handleDownload6 = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Interactive Data");

    // 1. Menambahkan Checkbox (Boolean: TRUE/FALSE)
    worksheet.getCell("A1").value = "Task Completed";
    worksheet.getCell("B1").value = true; // Checkbox TRUE
    worksheet.getCell("B2").value = false; // Checkbox FALSE

    // Format kolom B agar tampil dengan "checkbox-like" format di Excel
    worksheet.getColumn(2).numFmt = "BOOLEAN"; // Excel akan menganggap TRUE/FALSE

    // 2. Menambahkan Hyperlink
    const linkCell = worksheet.getCell("A4");
    linkCell.value = {
      text: "Visit Google",
      hyperlink: "https://www.google.com",
    };
    linkCell.font = { underline: true, color: { argb: "FF0000FF" } };

    // 3. Menambahkan Gambar dari Path atau URL
    const imageUrl = "/path/to/your/image.png"; // Ganti dengan path gambar lokal
    const image = await fetch(imageUrl).then((res) => res.blob());
    const imageId = workbook.addImage({
      buffer: await image.arrayBuffer(),
      extension: "png",
    });

    worksheet.addImage(imageId, {
      tl: { col: 1, row: 6 }, // Top-left corner (B7)
      ext: { width: 100, height: 100 }, // Ukuran gambar
    });

    // 4. Simpan Workbook sebagai File Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "InteractiveExcel.xlsx");
  };

  return (
    <>
      <button onClick={handleDownload}>Download Excel</button>;
      <button onClick={handleDownload2}>Download2 Excel</button>;
      <button onClick={handleDownload3}>Download3 Excel</button>;
      <button onClick={handleDownload4}>Download4 Excel</button>;
      <button onClick={handleDownload5}>Download5 Excel</button>;
      <button onClick={handleDownload6}>Download6 Excel</button>;
    </>
  );
}
