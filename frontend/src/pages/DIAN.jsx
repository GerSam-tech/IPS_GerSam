import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import { useState } from 'react';

// Función auxiliar para simular el código hash CUFE (Código Único de Factura Electrónica)
const generateCUFE = () => {
  return Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
};

const DIAN = ({ goTo }) => {
  // --- ESTADOS PARA CREACIÓN DE FACTURA ---
  const [cliente, setCliente] = useState({ nombre: '', documento: '', correo: '' });
  const [servicioActual, setServicioActual] = useState({ descripcion: 'Consulta Optometría', cantidad: 1, valorUnitario: 50000 });
  const [servicios, setServicios] = useState([]);
  
  // --- BASE DE DATOS MOCK DE FACTURAS ---
  const [facturas, setFacturas] = useState([
    { 
      numeroFactura: 'FE-2025-0086', 
      fecha: '2025-04-01T10:00:00', 
      cliente: { nombre: 'María Rodríguez Gómez', documento: '1023456789', correo: 'maria@example.com' }, 
      servicios: [{ descripcion: 'Consulta Optometría', cantidad: 1, valorUnitario: 50000, total: 50000 }],
      subtotal: 50000, impuestos: 0, total: 50000, 
      estado: 'APROBADA', 
      cufe: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      errores: []
    }
  ]);

  const [vistaPrevia, setVistaPrevia] = useState(null);

  // --- LÓGICA DE CREACIÓN ---
  const handleClienteChange = (e) => setCliente({ ...cliente, [e.target.name]: e.target.value });
  const handleServicioChange = (e) => setServicioActual({ ...servicioActual, [e.target.name]: e.target.name === 'descripcion' ? e.target.value : Number(e.target.value) });

  const agregarServicio = () => {
    if (!servicioActual.descripcion || servicioActual.cantidad <= 0 || servicioActual.valorUnitario < 0) {
      alert("Valores de servicio inválidos.");
      return;
    }
    const nuevo = { ...servicioActual, total: servicioActual.cantidad * servicioActual.valorUnitario };
    setServicios([...servicios, nuevo]);
    setServicioActual({ descripcion: 'Consulta Optometría', cantidad: 1, valorUnitario: 50000 });
  };

  const eliminarServicio = (index) => {
    setServicios(servicios.filter((_, i) => i !== index));
  };

  const subtotalFactura = servicios.reduce((acc, curr) => acc + curr.total, 0);
  // Servicios de salud en Colombia usualmente son exentos de IVA, pero simulamos un 0%
  const impuestosFactura = 0; 
  const totalFactura = subtotalFactura + impuestosFactura;

  const generarFactura = () => {
    if (!cliente.nombre || !cliente.documento) {
      alert("Debe ingresar los datos del cliente.");
      return;
    }
    if (servicios.length === 0) {
      alert("No se puede generar una factura sin servicios.");
      return;
    }
    if (totalFactura <= 0) {
      alert("El total de la factura debe ser mayor a 0.");
      return;
    }

    const nuevaFactura = {
      numeroFactura: `FE-2025-00${facturas.length + 87}`, // Simulador de consecutivo
      fecha: new Date().toISOString(),
      cliente: { ...cliente },
      servicios: [...servicios],
      subtotal: subtotalFactura,
      impuestos: impuestosFactura,
      total: totalFactura,
      estado: 'BORRADOR',
      cufe: null,
      errores: []
    };

    setFacturas([nuevaFactura, ...facturas]);
    
    // Limpiar formulario
    setCliente({ nombre: '', documento: '', correo: '' });
    setServicios([]);
    alert(`Factura ${nuevaFactura.numeroFactura} creada como BORRADOR.`);
  };

  const enviarCorreoReal = (factura) => {
    if (!factura.cliente.correo) {
      alert("El cliente no tiene un correo registrado.");
      return;
    }
    const subject = encodeURIComponent(`Factura Electrónica ${factura.numeroFactura} - GERSAM AXIS`);
    const body = encodeURIComponent(`Hola ${factura.cliente.nombre},\n\nA continuación los detalles de su factura electrónica de venta.\n\nNúmero de Factura: ${factura.numeroFactura}\nFecha: ${new Date(factura.fecha).toLocaleString()}\nValor Total: $${factura.total.toLocaleString()} COP\nEstado DIAN: ${factura.estado}\nCUFE: ${factura.cufe || 'En proceso'}\n\nGracias por confiar en nuestros servicios.`);
    // Esto abre el gestor de correos real del usuario (Outlook, Gmail, Apple Mail)
    window.location.href = `mailto:${factura.cliente.correo}?subject=${subject}&body=${body}`;
  };

  const exportarPDFDirecto = (factura) => {
    setVistaPrevia(factura); // Abre la vista previa
    setTimeout(() => {
      window.print(); // Espera a que renderice y lanza la ventana de impresión real
    }, 400);
  };

  // --- SIMULACIÓN DE PASARELA DIAN ---
  const enviarFacturaDIAN = (numeroFactura) => {
    // 1. Cambiar a ENVIANDO
    setFacturas(prev => prev.map(f => f.numeroFactura === numeroFactura ? { ...f, estado: 'ENVIANDO...' } : f));

    // 2. Simular delay de la red y validación de la DIAN (1.5s)
    setTimeout(() => {
      const aprobada = Math.random() > 0.2; // 80% probabilidad de aprobación
      
      setFacturas(prev => prev.map(f => {
        if (f.numeroFactura === numeroFactura) {
          if (aprobada) {
            return {
              ...f,
              estado: 'APROBADA',
              cufe: generateCUFE(),
              errores: []
            };
          } else {
            return {
              ...f,
              estado: 'RECHAZADA',
              cufe: null,
              errores: [{ 
                codigo: "Regla: 90", 
                mensaje: "El documento XML no cumple con el esquema XSD de la DIAN. Valor de prueba simulado de rechazo." 
              }]
            };
          }
        }
        return f;
      }));
    }, 1500);
  };

  const getStatusPill = (estado) => {
    switch (estado) {
      case 'APROBADA': return 'pill-done';
      case 'RECHAZADA': return 'pill-canc';
      case 'BORRADOR': return 'pill-prog'; // reutilizamos el estilo de en progreso o azul
      default: return 'pill-pend';
    }
  };

  return (
    <div className="section active">
      <div className="grid-main">
        {/* PANEL IZQUIERDO: CREADOR DE FACTURA */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">📝 Emitir Nueva Factura Electrónica</div>
          </div>
          <div className="card-body">
            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>DATOS DEL CLIENTE / PACIENTE</div>
            <div className="form-grid g3" style={{ marginBottom: '16px' }}>
              <div className="field span2"><label>Nombre Completo / Razón Social</label><input type="text" name="nombre" value={cliente.nombre} onChange={handleClienteChange} /></div>
              <div className="field"><label>N° Documento / NIT</label><input type="text" name="documento" value={cliente.documento} onChange={handleClienteChange} /></div>
              <div className="field span-full"><label>Correo Electrónico (Para envío XML/PDF)</label><input type="email" name="correo" value={cliente.correo} onChange={handleClienteChange} /></div>
            </div>

            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>DETALLE DE SERVICIOS</div>
            <div className="form-grid g3" style={{ alignItems: 'end', marginBottom: '14px' }}>
              <div className="field span2"><label>Descripción del Servicio</label><input type="text" name="descripcion" value={servicioActual.descripcion} onChange={handleServicioChange} /></div>
              <div className="field"><label>Cantidad</label><input type="number" name="cantidad" value={servicioActual.cantidad} onChange={handleServicioChange} min="1" /></div>
              <div className="field span2"><label>Valor Unitario (COP)</label><input type="number" name="valorUnitario" value={servicioActual.valorUnitario} onChange={handleServicioChange} min="0" /></div>
              <div className="field"><GlobalVoiceBtn />
            <button className="btn" onClick={agregarServicio} style={{ width: '100%', justifyContent: 'center' }}>+ Añadir</button></div>
            </div>

            {servicios.length > 0 && (
              <table className="tbl" style={{ marginBottom: '16px' }}>
                <thead><tr><th>Servicio</th><th>Cant.</th><th>V. Unitario</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {servicios.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.descripcion}</td><td>{s.cantidad}</td>
                      <td>${s.valorUnitario.toLocaleString()}</td><td>${s.total.toLocaleString()}</td>
                      <td><span style={{cursor:'pointer', color:'var(--red)'}} onClick={() => eliminarServicio(idx)}>✕</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ background: 'var(--bg2)', padding: '12px', borderRadius: '6px', textAlign: 'right', marginBottom: '16px' }}>
              <div style={{ fontSize: '.8rem', color: 'var(--text2)' }}>Subtotal: ${subtotalFactura.toLocaleString()}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--text2)' }}>Impuestos (Exento 0%): $0</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>Total FEV: ${totalFactura.toLocaleString()}</div>
            </div>

            <button className="btn primary" onClick={generarFactura} style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>💾 Generar Factura (Borrador)</button>
          </div>
        </div>

        {/* PANEL DERECHO: HISTORIAL Y ACCIONES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-head">
              <div className="card-title">🏛️ Historial y Envíos DIAN</div>
            </div>
            <div style={{ padding: '10px 16px' }}>
              <table className="tbl">
                <thead><tr><th>Factura</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {facturas.map((f, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{f.numeroFactura}</td>
                      <td style={{ fontSize: '.75rem' }}>{f.cliente.nombre}<br/><span style={{ color: 'var(--text3)' }}>CC {f.cliente.documento}</span></td>
                      <td>${f.total.toLocaleString()}</td>
                      <td><span className={`pill ${getStatusPill(f.estado)}`}>{f.estado}</span></td>
                      <td style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <button className="btn" onClick={() => setVistaPrevia(f)} style={{ padding: '3px 6px', fontSize: '.7rem' }}>📄 Ver</button>
                        {f.estado === 'BORRADOR' || f.estado === 'RECHAZADA' ? (
                          <button className="btn dian" onClick={() => enviarFacturaDIAN(f.numeroFactura)} style={{ padding: '3px 6px', fontSize: '.7rem' }}>📡 DIAN</button>
                        ) : null}
                        {f.estado === 'APROBADA' && (
                          <button className="btn success" onClick={() => goTo('rips')} style={{ padding: '3px 6px', fontSize: '.7rem' }} title="Usar para RIPS">🗂️ RIPS</button>
                        )}
                        <button className="btn" onClick={() => exportarPDFDirecto(f)} style={{ padding: '3px 6px', fontSize: '.7rem' }} title="Generar PDF Real">🖨️ PDF</button>
                        <button className="btn" onClick={() => enviarCorreoReal(f)} style={{ padding: '3px 6px', fontSize: '.7rem' }} title="Enviar Email Real al Cliente">✉️ Correo</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: '.65rem', color: 'var(--text3)', marginTop: '10px' }}>
                * Las facturas <b>APROBADAS</b> generan un CUFE y quedan listas para ser enlazadas al JSON de RIPS (Resolución 2275).
              </div>
            </div>
          </div>

          {/* VISTA ESTRUCTURADA SIMULADA DE LA FACTURA (PDF/JSON) */}
          {vistaPrevia && (
            <div className="card" style={{ border: '1px solid var(--accent1)' }}>
              <div className="card-head" style={{ background: 'rgba(0,180,216,0.1)' }}>
                <div className="card-title">📄 Vista Estructurada FEV: {vistaPrevia.numeroFactura}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button className="btn success" onClick={() => window.print()} style={{ padding: '4px 10px', fontSize: '.75rem' }}>📄 Exportar PDF</button>
                  <button className="btn" onClick={() => enviarCorreoReal(vistaPrevia)} style={{ padding: '4px 10px', fontSize: '.75rem' }}>✉️ Enviar Correo</button>
                  <button className="btn danger" onClick={() => setVistaPrevia(null)} style={{ padding: '4px 10px', fontSize: '.75rem' }}>✕ Cerrar</button>
                </div>
              </div>
              <div className="card-body" style={{ fontSize: '.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <div>
                    <strong>Emisor:</strong> GERSAM AXIS S.A.S<br/>
                    <strong>NIT:</strong> 900.123.456-7<br/>
                    <strong>Fecha:</strong> {new Date(vistaPrevia.fecha).toLocaleString()}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Adquirente:</strong> {vistaPrevia.cliente.nombre}<br/>
                    <strong>CC/NIT:</strong> {vistaPrevia.cliente.documento}<br/>
                    <span className={`pill ${getStatusPill(vistaPrevia.estado)}`} style={{ marginTop: '4px', display: 'inline-block' }}>{vistaPrevia.estado}</span>
                  </div>
                </div>
                
                <table className="tbl" style={{ marginBottom: '14px' }}>
                  <thead><tr><th>Concepto</th><th>Cant.</th><th>V. Unit</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {vistaPrevia.servicios.map((s, i) => (
                      <tr key={i}><td>{s.descripcion}</td><td>{s.cantidad}</td><td>${s.valorUnitario.toLocaleString()}</td><td>${s.total.toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '1rem', marginBottom: '14px' }}>TOTAL: ${vistaPrevia.total.toLocaleString()}</div>
                
                {vistaPrevia.cufe && (
                  <div style={{ background: 'var(--bg3)', padding: '10px', borderRadius: '4px', fontSize: '.65rem', wordBreak: 'break-all' }}>
                    <strong style={{ color: 'var(--green)' }}>✅ APROBADA POR LA DIAN</strong><br/>
                    <strong>CUFE:</strong> {vistaPrevia.cufe}
                  </div>
                )}

                {vistaPrevia.errores && vistaPrevia.errores.length > 0 && (
                  <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '4px', fontSize: '.7rem', color: '#991b1b', marginTop: '10px' }}>
                    <strong>❌ RECHAZO DIAN:</strong>
                    <ul style={{ margin: 0, paddingLeft: '14px' }}>
                      {vistaPrevia.errores.map((e, i) => <li key={i}>{e.codigo}: {e.mensaje}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DIAN;