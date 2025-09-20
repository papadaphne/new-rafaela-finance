// File: src/utils/exportUtils.js
import * as XLSX from 'xlsx';

export const exportToCSV = (data, filename) => {
  const headers = ['Tanggal', 'Jenis', 'Kategori', 'Deskripsi', 'Jumlah (Rp)'];
  
  const csvData = data.map(item => [
    item.date.toDate().toLocaleDateString('id-ID'),
    item.type,
    item.category,
    item.description,
    item.amount
  ]);
  
  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(item => ({
      Tanggal: item.date.toDate().toLocaleDateString('id-ID'),
      Jenis: item.type,
      Kategori: item.category,
      Deskripsi: item.description,
      'Jumlah (Rp)': item.amount
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
