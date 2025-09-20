// File: src/pages/Transactions.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ModalForm from '../components/ModalForm';

const Transactions = () => {
  const { userRole } = useAuth();
  const { 
    transactions, 
    categories, 
    addTransaction, 
    deleteTransaction,
    addCategory 
  } = useFirestore();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showModalForm, setShowModalForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAddTransaction = async (transactionData) => {
    await addTransaction(transactionData);
    setShowTransactionForm(false);
  };

  const handleAddModal = async (modalData) => {
    await addTransaction({
      ...modalData,
      type: 'modal',
      category: 'modal'
    });
    setShowModalForm(false);
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await addCategory({
        name: newCategoryName,
        type: 'expense'
      });
      setNewCategoryName('');
      setShowCategoryForm(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">💸 Transaksi</h1>
        <div className="flex space-x-2">
          {userRole === 'owner' && (
            <button
              onClick={() => setShowModalForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Tambah Modal
            </button>
          )}
          <button
            onClick={() => setShowTransactionForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Transaksi Baru
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Semua</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
          <option value="hpp">HPP</option>
          <option value="operational">Operasional</option>
          <option value="modal">Modal</option>
        </select>
      </div>

      {/* Tambah Kategori (Hanya Owner) */}
      {userRole === 'owner' && (
        <div className="mb-4">
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Tambah Kategori
          </button>
          {showCategoryForm && (
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nama kategori baru"
                className="border rounded px-3 py-2 mr-2"
              />
              <button
                onClick={handleAddCategory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
              >
                Tambah
              </button>
            </div>
          )}
        </div>
      )}

      {/* Daftar Transaksi */}
      <TransactionList 
        transactions={filteredTransactions}
        onDelete={deleteTransaction}
        userRole={userRole}
      />

      {/* Form Modal Transaksi */}
      {showTransactionForm && (
        <TransactionForm
          categories={categories}
          onSubmit={handleAddTransaction}
          onCancel={() => setShowTransactionForm(false)}
        />
      )}

      {/* Form Modal */}
      {showModalForm && (
        <ModalForm
          onSubmit={handleAddModal}
          onCancel={() => setShowModalForm(false)}
        />
      )}
    </div>
  );
};

export default Transactions;
