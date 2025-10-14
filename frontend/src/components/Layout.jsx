// @ts-check
import { useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from '@vitejs/plugin-react-router';

/**
 * Layout principal
 */
export function MainLayout({ children }) {
  const { user, loading } = useStore();
  const navigate = useNavigate();

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  // Renderizar layout apenas se autenticado
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="AgroSync"
            />
          </div>

          {/* Menu */}
          <div className="flex items-center space-x-4">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/shop">Loja</NavLink>
            <NavLink to="/messages">Mensagens</NavLink>

            {/* Perfil */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatar_url || '/default-avatar.png'}
                  alt={user.name}
                />
                <span>{user.name}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AgroSync. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Link de navegação
 */
function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <a
      href={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        active
          ? 'bg-green-100 text-green-700'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </a>
  );
}

/**
 * Layout para páginas de autenticação
 */
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/logo.svg"
          alt="AgroSync"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          AgroSync
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}