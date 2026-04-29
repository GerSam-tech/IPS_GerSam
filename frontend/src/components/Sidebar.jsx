const Sidebar = ({ isCollapsed, toggleSidebar, activeSection, setActiveSection }) => {
  const NavItem = ({ id, icon, label, badge }) => (
    <div 
      className={`nav-item ${activeSection === id ? 'active' : ''}`} 
      onClick={() => setActiveSection(id)}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </div>
  );

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="crossG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00b4d8"/>
                <stop offset="50%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#7c3aed"/>
              </linearGradient>
              <linearGradient id="swooshG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981"/>
                <stop offset="100%" stopColor="#00b4d8"/>
              </linearGradient>
            </defs>
            <rect x="12" y="4" width="12" height="28" rx="3" fill="url(#crossG)"/>
            <rect x="4" y="12" width="28" height="12" rx="3" fill="url(#crossG)"/>
            <rect x="15.5" y="8" width="5" height="20" rx="1" fill="white" opacity=".9"/>
            <rect x="8" y="15.5" width="20" height="5" rx="1" fill="white" opacity=".9"/>
            <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#swooshG)" strokeWidth="1.5" fill="none" transform="rotate(-20 18 18)"/>
            <circle cx="30" cy="11" r="2" fill="#23e5c0"/>
          </svg>
        </div>
        <div className="logo-text">
          <div className="logo-name">Gersam Axis</div>
          <div className="logo-sub">Sistema Médico IPS</div>
        </div>
      </div>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? '▶' : '◀'}
      </div>

      <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '16px' }}>
        <div className="nav-section">Principal</div>
        <NavItem id="dashboard" icon="📊" label="Panel de Control" />
        <NavItem id="agenda" icon="📅" label="Agendamiento" badge="4" />

        <div className="nav-section">Pacientes</div>
        <NavItem id="registro" icon="👤" label="Registro Paciente" />
        <NavItem id="hc" icon="📋" label="Historia Clínica" />
        <NavItem id="rda" icon="🔬" label="RDA Optometría" />

        <div className="nav-section">Facturación</div>
        <NavItem id="rips" icon="🗂️" label="RIPS / FEV-RIPS" />
        <NavItem id="dian" icon="🏛️" label="Factura DIAN" />

        <div className="nav-section">Operaciones</div>
        <NavItem id="inventario" icon="📦" label="Inventario" />
        <NavItem id="notificaciones" icon="💬" label="WhatsApp Notif." badge="3" />

        <div className="nav-section">Sistema</div>
        <NavItem id="reportes" icon="📈" label="Reportes" />
        <NavItem id="config" icon="⚙️" label="Configuración" />
      </div>
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="av av1" style={{ width: '28px', height: '28px', fontSize: '.65rem' }}>AS</div>
          <div className="logo-text">
            <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--text)' }}>Opt. Andrea Salcedo</div>
            <div style={{ fontSize: '.65rem', color: 'var(--text3)' }}>Optometría</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
