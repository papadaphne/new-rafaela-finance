// File: src/pages/Settings.js
import React, { useState } from 'react';
import { useFirestore } from '../contexts/FirestoreContext';

const Settings = () => {
  const { categories, addCategory, deleteCategory } = useFirestore();
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense'
  });

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      await addCategory(newCategory);
      setNewCategory({ name: '', type: 'expense' });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">⚙️ Pengaturan</h1>
      
      {/* Manajemen Kategori */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Kelola Kategori</h2>
        
        {/* Form Tambah Kategori */}
        <form onSubmit={handleAddCategory} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Nama Kategori</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Jenis</label>
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
                <option value="both">Keduanya</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Tambah Kategori
              </button>
            </div>
          </div>
        </form>
        
        {/* Daftar Kategori */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Daftar Kategori</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Jenis</th>
                  <th className="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id} className="border-b">
                    <td className="px-4 py-2">{category.name}</td>
                    <td className="px-4 py-2 capitalize">
                      {category.type === 'both' ? 'Pemasukan & Pengeluaran' : category.type}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Pengaturan Lainnya */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Pengaturan Lainnya</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Backup Data</h3>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Backup Data ke CSV
            </button>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Reset Data</h3>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Reset Semua Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
