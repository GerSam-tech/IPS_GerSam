import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import { useState } from 'react';

const Notificaciones = () => {
  const [logs, setLogs] = useState([
    { id: 1, type: 'Recordatorio', paciente: 'Carlos Jiménez', num: '+57 300 000 0000', status: 'Pendiente', fecha: 'Hoy 08:45' },
    { id: 2, type: 'Lentes Listos', paciente: 'Ana Gómez', num: '+57 320 123 4567', status: 'Enviado', fecha: 'Ayer 15:30' },
    { id: 3, type: 'Control Anual', paciente: 'Luis Pérez', num: '+57 311 987 6543', status: 'Enviado', fecha: 'Ayer 09:00' }
  ]);

  const enviarPendientes = () => {
    alert("Simulando envío masivo por WhatsApp Business API...");
    setLogs(logs.map(l => l.status === 'Pendiente' ? { ...l, status: 'Enviado' } : l));
  };

  return (
    <div className="section active">
      <div className="grid2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">💬 Centro de Notificaciones (WhatsApp)</div>
            <GlobalVoiceBtn />
            <button className="btn wa" style={{ background: '#25D366', color: 'white', borderColor: '#25D366' }} onClick={enviarPendientes}>
              🚀 Enviar Pendientes
            </button>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '.8rem', color: 'var(--text2)', marginBottom: '16px' }}>
              El sistema automatiza mensajes por WhatsApp para recordatorios de citas, avisos de entrega de trabajos ópticos y seguimientos post-consulta.
            </p>
            
            <table className="tbl">
              <thead>
                <tr><th>Tipo de Aviso</th><th>Paciente</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td><strong style={{ color: 'var(--text)' }}>{log.type}</strong><br/><span style={{ fontSize: '.7rem', color: 'var(--text3)' }}>{log.fecha}</span></td>
                    <td>{log.paciente}<br/><span style={{ fontSize: '.75rem', color: 'var(--text2)' }}>{log.num}</span></td>
                    <td>
                      {log.status === 'Enviado' ? (
                        <span className="pill pill-done">✓ Enviado</span>
                      ) : (
                        <span className="pill pill-prog">⏳ Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">⚙️ Plantillas de Mensajes</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg2)' }}>
              <div style={{ fontWeight: 600, fontSize: '.8rem', marginBottom: '6px' }}>Recordatorio de Cita</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text2)', fontStyle: 'italic' }}>
                "Hola {'{paciente}'}, recuerda tu cita de {'{motivo}'} para el día {'{fecha}'} a las {'{hora}'}. GERSAM AXIS S.A.S"
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg2)' }}>
              <div style={{ fontWeight: 600, fontSize: '.8rem', marginBottom: '6px' }}>Entrega de Lentes / Gafas</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text2)', fontStyle: 'italic' }}>
                "Hola {'{paciente}'}, ¡Tus lentes ya están listos! Puedes pasar a recogerlos a nuestra sede en tu horario de conveniencia."
              </div>
            </div>

            <button className="btn" style={{ justifyContent: 'center' }}>+ Añadir Nueva Plantilla</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;