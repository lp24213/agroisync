// @ts-check
import { createRouter, createBrowserHistory } from '@vitejs/plugin-react-router';

// Rotas lazy-loaded
const Login = () => import('./pages/Login.jsx');
const Register = () => import('./pages/Register.jsx');
const Recover = () => import('./pages/Recover.jsx');
const Dashboard = () => import('./pages/Dashboard.jsx');
const Shop = () => import('./pages/Shop.jsx');
const Messages = () => import('./pages/Messages.jsx');
const NotFound = () => import('./pages/NotFound.jsx');

// Middleware de autenticação
function requireAuth(to, from, next) {
  const token = localStorage.getItem('agroisync_auth_token');
  if (!token) {
    next('/login');
  } else {
    next();
  }
}

// Middleware de visitante
function requireGuest(to, from, next) {
  const token = localStorage.getItem('agroisync_auth_token');
  if (token) {
    next('/dashboard');
  } else {
    next();
  }
}

// Configuração das rotas
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: requireGuest
  },
  {
    path: '/register',
    component: Register,
    beforeEnter: requireGuest
  },
  {
    path: '/recover',
    component: Recover,
    beforeEnter: requireGuest
  },
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: requireAuth
  },
  {
    path: '/shop',
    component: Shop,
    beforeEnter: requireAuth
  },
  {
    path: '/messages',
    component: Messages,
    beforeEnter: requireAuth
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
];

// Criar roteador
export const router = createRouter({
  history: createBrowserHistory(),
  routes
});