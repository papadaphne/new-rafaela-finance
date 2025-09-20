import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { userRole } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {userRole}!</p>
      {/* Tambahkan komponen dashboard sesuai kebutuhan */}
    </div>
  );
}
