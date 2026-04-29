import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Registro from './pages/Registro';
import HistoriaClinica from './pages/HistoriaClinica';
import RDA from './pages/RDA';
import RIPS from './pages/RIPS';
import DIAN from './pages/DIAN';
import Inventario from './pages/Inventario';
import Notificaciones from './pages/Notificaciones';
import Reportes from './pages/Reportes';
import Config from './pages/Config';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard goTo={setActiveSection} />;
      case 'agenda': return <Agenda goTo={setActiveSection} />;
      case 'registro': return <Registro goTo={setActiveSection} />;
      case 'hc': return <HistoriaClinica goTo={setActiveSection} />;
      case 'rda': return <RDA goTo={setActiveSection} />;
      case 'rips': return <RIPS goTo={setActiveSection} />;
      case 'dian': return <DIAN goTo={setActiveSection} />;
      case 'inventario': return <Inventario goTo={setActiveSection} />;
      case 'notificaciones': return <Notificaciones goTo={setActiveSection} />;
      case 'reportes': return <Reportes goTo={setActiveSection} />;
      case 'config': return <Config goTo={setActiveSection} />;
      default: return <Dashboard goTo={setActiveSection} />;
    }
  };

  const getTitle = () => {
    const titles = {
      dashboard: 'Panel de Control', agenda: 'Agendamiento – Google Calendar',
      registro: 'Registro de Paciente (CIE-10)', hc: 'Historia Clínica',
      rda: 'RDA – Registro Diario de Atención', rips: 'RIPS / FEV-RIPS JSON',
      dian: 'Facturación Electrónica DIAN', inventario: 'Gestión de Inventario',
      notificaciones: 'Notificaciones WhatsApp Business', reportes: 'Reportes y Estadísticas',
      config: 'Configuración del Sistema'
    };
    return titles[activeSection] || 'Panel de Control';
  };

  return (
    <>
      <div className="grid-bg"></div>
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="main-wrap" style={{ left: isSidebarCollapsed ? '70px' : '240px' }}>
        <Topbar 
          title={getTitle()} 
          isCollapsed={isSidebarCollapsed}
          goTo={setActiveSection} 
        />
        
        <div className="main">
          {renderSection()}
        </div>
      </div>
    </>
  );
}

export default App;
