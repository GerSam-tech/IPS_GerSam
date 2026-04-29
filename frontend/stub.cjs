const fs = require('fs');
const pages = ['Agenda', 'Registro', 'HistoriaClinica', 'RDA', 'RIPS', 'DIAN', 'Inventario', 'Notificaciones', 'Reportes', 'Config'];

pages.forEach(p => {
  const content = `const ${p} = ({ goTo }) => {
  return (
    <div className="section active">
      <div className="card">
        <div className="card-head">
          <div className="card-title">${p}</div>
        </div>
        <div className="card-body">
          Sección en migración a React...
        </div>
      </div>
    </div>
  );
};
export default ${p};`;
  
  fs.writeFileSync(`d:/Documentos/IPS/frontend/src/pages/${p}.jsx`, content, 'utf8');
});

console.log('Stubs creados exitosamente');
