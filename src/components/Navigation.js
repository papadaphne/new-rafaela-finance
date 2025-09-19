import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { userRole, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: '🏠 Dashboard', roles: ['owner', 'employee'] },
    { path: '/orders', label: '🛒 Pesanan', roles: ['owner', 'employee'] },
    { path: '/transactions', label: '💸 Transaksi', roles: ['owner', 'employee'] },
    { path: '/reports', label: '📄 Laporan', roles: ['owner'] },
    { path: '/settings', label: '⚙️ Pengaturan', roles: ['owner'] },
  ];

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo-rafaela.png" alt="Logo" className="h-8" />
          <span className="font-bold text-xl">Rafaela Finance</span>
        </div>
        
        <div className="flex space-x-4">
          {menuItems.map((item) => {
            if (item.roles.includes(userRole)) {
              return (
                <a 
                  key={item.path} 
                  href={item.path}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  {item.label}
                </a>
              );
            }
            return null;
          })}
          
          <button 
            onClick={logout}
            className="hover:bg-blue-700 px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
