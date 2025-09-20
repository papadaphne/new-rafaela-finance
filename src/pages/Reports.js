// File: src/pages/Reports.js
import React, { useState, useMemo } from 'react';
import { useFirestore } from '../contexts/FirestoreContext';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

const Reports = () => {
  const { transactions, categories } = useFirestore();
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    category: 'all',
    type: 'all'
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = transaction.date.toDate();
      const matchesMonth = filters.month === 'all' || 
                          (transactionDate.getMonth() + 1) === parseInt(filters.month);
      const matchesYear = filters.year === 'all' || 
                         transactionDate.getFullYear() === parseInt(filters.year);
      const matchesCategory = filters.category === 'all' || 
                             transaction.category === filters.category;
      const matchesType = filters.type === 'all' || 
                         transaction.type === filters.type;

      return matchesMonth && matchesYear && matchesCategory && matchesType;
    });
  }, [transactions, filters]);

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions, `laporan-rafaela-${filters.month}-${filters.year}`);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredTransactions, `laporan-rafaela-${filters.month}-${filters.year}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hitung total untuk setiap jenis transaksi
  const totals = filteredTransactions.reduce((acc, transaction) => {
    const amount = transaction.amount || 0;
    if (!acc[transaction.type]) {
      acc[transaction.type] = 0;
    }
    acc[transaction.type] += amount;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📄 Laporan Keuangan</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Filter Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1">Bulan</label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">Semua Bulan</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Tahun</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">Semua Tahun</option>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block mb-1">Kategori</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Jenis Transaksi</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">Semua Jenis</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
              <option value="hpp">HPP</option>
              <option value="operational">Operasional</option>
              <option value="modal">Modal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Ringkasan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold">Total Pemasukan</h3>
            <p className="text-2xl">Rp {totals.income?.toLocaleString('id-ID') || 0}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="font-semibold">Total Pengeluaran</h3>
            <p className="text-2xl">Rp {totals.expense?.toLocaleString('id-ID') || 0}</p>
          </div>
          <div className={`p-4 rounded ${(totals.income || 0) - (totals.expense || 0) >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
            <h3 className="font-semibold">Laba/Rugi Bersih</h3>
            <p className="text-2xl">
              Rp {((totals.income || 0) - (totals.expense || 0)).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Daftar Transaksi */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Detail Transaksi ({filteredTransactions.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Jenis</th>
                <th className="px-4 py-2 text-left">Kategori</th>
                <th className="px-4 py-2 text-left">Deskripsi</th>
                <th className="px-4 py-2 text-right">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="border-b">
                  <td className="px-4 py-2">
                    {transaction.date.toDate().toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-2 capitalize">{transaction.type}</td>
                  <td className="px-4 py-2">{transaction.category}</td>
                  <td className="px-4 py-2">{transaction.description}</td>
                  <td className="px-4 py-2 text-right">
                    {transaction.amount.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
