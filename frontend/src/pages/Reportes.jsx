import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
const Reportes = () => {
  const descargarCSV = (nombre) => {
    const blob = new Blob(["Columna1,Columna2\nDatos de Prueba,123"], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="section active">
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '200px' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent1)' }}>1,452</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Pacientes Activos</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '200px' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👁️</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--green)' }}>348</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Consultas este Mes</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '200px' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🧾</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue)' }}>$ 24.5M</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Ingresos FEV (Abril)</div>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">📈 Top Diagnósticos (CIE-10)</div>
          </div>
          <div className="card-body">
            <table className="tbl">
              <thead><tr><th>Diagnóstico</th><th>Casos Mensuales</th><th>Porcentaje</th></tr></thead>
              <tbody>
                <tr><td>H521 - Miopía</td><td>120</td><td>35%</td></tr>
                <tr><td>H522 - Astigmatismo</td><td>85</td><td>25%</td></tr>
                <tr><td>H524 - Presbicia</td><td>60</td><td>17%</td></tr>
                <tr><td>H041 - Ojo Seco</td><td>30</td><td>8%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">⬇️ Exportar Reportes RIPS / DIAN</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '.8rem', color: 'var(--text2)' }}>Descarga de informes consolidados en formatos requeridos por entidades reguladoras.</p>
            <GlobalVoiceBtn />
            <button className="btn success" onClick={() => descargarCSV('Resumen_RIPS_Mensual')} style={{ justifyContent: 'center' }}>⬇️ Descargar Resumen RIPS (CSV)</button>
            <button className="btn dian" onClick={() => window.print()} style={{ justifyContent: 'center' }}>🖨️ Reporte de Facturación (Imprimir PDF)</button>
            <button className="btn" onClick={() => descargarCSV('Base_Datos_Pacientes_Activos')} style={{ justifyContent: 'center' }}>⬇️ Base de Datos de Pacientes (CSV)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;