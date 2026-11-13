import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/app", label: "Dashboard", end: true },
  { to: "/app/transacoes", label: "Transações" },
  { to: "/app/categorias", label: "Categorias" },
  { to: "/app/relatorios", label: "Relatórios" },
  { to: "/app/configuracoes", label: "Configurações" },
];

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">GraphUp</div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}