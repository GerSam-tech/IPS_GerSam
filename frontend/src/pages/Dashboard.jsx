import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import { patients, getStatusClass } from '../data/mockData';

const Dashboard = ({ goTo }) => {
  return (
    <div className="section active">
      <div className="metrics-row">
        <div className="metric"><div className="metric-label">Atenciones Hoy</div><div className="metric-val">14</div><div className="metric-sub">↑ 4 vs ayer</div></div>
        <div className="metric"><div className="metric-label">Completadas</div><div className="metric-val green">9</div><div className="metric-sub">64% del turno</div></div>
        <div className="metric"><div className="metric-label">Fact. Electrón.</div><div className="metric-val teal">$2.4M</div><div className="metric-sub">7 facturas DIAN</div></div>
        <div className="metric"><div className="metric-label">RIPS Pendientes</div><div className="metric-val amber">3</div><div className="metric-sub">Generar y enviar</div></div>
        <div className="metric"><div className="metric-label">Stock Crítico</div><div className="metric-val red">5</div><div className="metric-sub">Ítems bajo mínimo</div></div>
      </div>

      <div className="grid-main">
        <div className="card">
          <div className="card-head">
            <div className="card-title">🗓️ Atenciones del Día</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <GlobalVoiceBtn />
            <button className="btn" onClick={() => goTo('rda')} style={{ padding: '5px 10px', fontSize: '.72rem' }}>+ RDA</button>
              <button className="btn primary" onClick={() => goTo('hc')} style={{ padding: '5px 10px', fontSize: '.72rem' }}>Historia Clínica</button>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Paciente</th><th>Hora</th><th>Diagnóstico</th><th>Profesional</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className={`av ${p.av}`}>{p.init}</div>
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--accent3)' }}>{p.hora}</td>
                  <td style={{ color: 'var(--text3)', fontSize: '.75rem' }}>{p.dx}</td>
                  <td>{p.prof}</td>
                  <td><span className={`pill ${getStatusClass(p.status)}`}>{p.status}</span></td>
                  <td style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button className="btn" style={{ padding: '3px 7px', fontSize: '.68rem' }} onClick={() => goTo('hc')}>HC</button>
                    <button className="btn" style={{ padding: '3px 7px', fontSize: '.68rem' }} onClick={() => goTo('rda')}>RDA</button>
                    <button className="btn wa" style={{ padding: '3px 7px', fontSize: '.68rem' }}>WA</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card">
            <div className="card-head"><div className="card-title">📡 Estado Integraciones</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--text2)' }}>🏛️ DIAN – Factura Electrónica</span>
                <span className="pill pill-done">● Conectado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--text2)' }}>📅 Google Calendar</span>
                <span className="pill pill-done">● Sincronizado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--text2)' }}>💬 WhatsApp Business</span>
                <span className="pill pill-done">● Activo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--text2)' }}>🗂️ RIPS – MINSALUD</span>
                <span className="pill pill-pend">● Pendiente sync</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--text2)' }}>🎙️ Reconocimiento de Voz</span>
                <span className="pill pill-prog">● Disponible</span>
              </div>
              <div className="glow-line"></div>
              <button className="btn success" style={{ width: '100%', justifyContent: 'center' }}>Sincronizar RIPS Ahora</button>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">📊 Resumen Inventario</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--text2)', marginBottom: '3px' }}>
                  <span>Lentes monofocales</span><span style={{ color: 'var(--green)' }}>142 uds</span>
                </div>
                <div className="inv-bar"><div className="inv-fill" style={{ width: '71%', background: 'var(--green)' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--text2)', marginBottom: '3px' }}>
                  <span>Gotas lubricantes</span><span style={{ color: 'var(--amber)' }}>18 uds</span>
                </div>
                <div className="inv-bar"><div className="inv-fill" style={{ width: '18%', background: 'var(--amber)' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--text2)', marginBottom: '3px' }}>
                  <span>Tropicamida 1%</span><span style={{ color: 'var(--red)' }}>4 uds</span>
                </div>
                <div className="inv-bar"><div className="inv-fill" style={{ width: '8%', background: 'var(--red)' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--text2)', marginBottom: '3px' }}>
                  <span>Lentes progresivos</span><span style={{ color: 'var(--accent1)' }}>67 uds</span>
                </div>
                <div className="inv-bar"><div className="inv-fill" style={{ width: '45%', background: 'var(--accent1)' }}></div></div>
              </div>
              <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '4px', fontSize: '.75rem' }} onClick={() => goTo('inventario')}>
                Ver inventario completo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
