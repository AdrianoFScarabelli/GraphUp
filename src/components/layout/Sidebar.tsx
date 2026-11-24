import { NavLink } from "react-router-dom";

const links = [
  { to: "/app", label: "Dashboard", end: true },
  { to: "/app/transacoes", label: "Transações" },
  { to: "/app/categorias", label: "Categorias" },
  { to: "/app/relatorios", label: "Relatórios" },
  { to: "/app/configuracoes", label: "Configurações" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <img className="sidebar-brand" src="/logoHorizontal.png" alt="imagem da logo horizontal" />
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
  );
}