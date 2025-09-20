// File: src/pages/Dashboard.js
import React from 'react';
import { useFirestore } from '../contexts/FirestoreContext';
import DashboardCard from '../components/DashboardCard';

const Dashboard = () => {
  const { 
    totalOrders, 
    totalSales, 
    totalHPP, 
    grossProfit, 
    totalIncome, 
    totalExpense, 
    netProfit 
  } = useFirestore();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">🏠 Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard 
          title="Total Pesanan" 
          value={totalOrders} 
          icon="🛒"
          color="blue"
        />
        <DashboardCard 
          title="Total Penjualan" 
          value={`Rp ${totalSales.toLocaleString('id-ID')}`} 
          icon="💰"
          color="green"
        />
        <DashboardCard 
          title="HPP" 
          value={`Rp ${totalHPP.toLocaleString('id-ID')}`} 
          icon="📦"
          color="red"
        />
        <DashboardCard 
          title="Laba Kotor" 
          value={`Rp ${grossProfit.toLocaleString('id-ID')}`} 
          icon="📊"
          color="green"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard 
          title="Pemasukan" 
          value={`Rp ${totalIncome.toLocaleString('id-ID')}`} 
          icon="↑"
          color="green"
        />
        <DashboardCard 
          title="Pengeluaran" 
          value={`Rp ${totalExpense.toLocaleString('id-ID')}`} 
          icon="↓"
          color="red"
        />
        <DashboardCard 
          title="Laba/Rugi Bersih" 
          value={`Rp ${netProfit.toLocaleString('id-ID')}`} 
          icon="⚖️"
          color={netProfit >= 0 ? 'green' : 'red'}
        />
      </div>
    </div>
  );
};

export default Dashboard;
