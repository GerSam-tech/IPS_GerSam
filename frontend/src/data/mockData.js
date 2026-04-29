export const patients = [
  { init: 'MR', av: 'av1', name: 'María Rodríguez', hora: '08:00', dx: 'H52.1 Miopía bilateral', prof: 'A. Salcedo', status: 'completado', phone: '+573124567890' },
  { init: 'CJ', av: 'av2', name: 'Carlos Jiménez', hora: '08:45', dx: 'H52.4 Presbicia', prof: 'A. Salcedo', status: 'completado', phone: '+573219876543' },
  { init: 'LF', av: 'av3', name: 'Luisa Fernanda Arias', hora: '09:30', dx: 'H52.2 Astigmatismo', prof: 'H. Monsalve', status: 'en proceso', phone: '+573001112233' },
  { init: 'JR', av: 'av4', name: 'Jorge Ramírez', hora: '10:15', dx: 'H40.1 Sospecha glaucoma', prof: 'H. Monsalve', status: 'pendiente', phone: '+573157778899' },
  { init: 'VC', av: 'av5', name: 'Valentina Castro', hora: '11:00', dx: 'H52.0 Hipermetropía', prof: 'A. Salcedo', status: 'pendiente', phone: '+573043334455' },
];

export const inventory = [
  { cod: 'INV-001', name: 'Lentes monofocales CR39', cat: 'Lentes ópticos', stock: 142, min: 20, val: '$18.000', ok: true },
  { cod: 'INV-002', name: 'Lentes progresivos', cat: 'Lentes ópticos', stock: 67, min: 10, val: '$85.000', ok: true },
  { cod: 'INV-003', name: 'Gotas lubricantes Optive', cat: 'Medicamentos', stock: 18, min: 30, val: '$24.000', ok: false },
  { cod: 'INV-004', name: 'Tropicamida 1% gotas', cat: 'Medicamentos', stock: 4, min: 20, val: '$12.000', ok: false },
  { cod: 'INV-005', name: 'Fenilefrina 2.5%', cat: 'Medicamentos', stock: 7, min: 15, val: '$14.000', ok: false },
  { cod: 'INV-006', name: 'Estuche para gafas', cat: 'Accesorios', stock: 230, min: 50, val: '$4.500', ok: true },
  { cod: 'INV-007', name: 'Solución limpiadora LC', cat: 'Insumos', stock: 12, min: 25, val: '$32.000', ok: false },
];

export const sintomasList = [
  'Disminución AV', 'Visión borrosa', 'Fotofobia', 'Diplopía', 'Cefalea', 'Ojo rojo', 
  'Secretas/Legañas', 'Ardor/Prurito', 'Cuerpo extraño', 'Halos/Destellos', 'Moscas volantes', 
  'Pérdida campo visual', 'Dolor ocular', 'Lagrimeo', 'Miopía progresiva', 'Dificultad visión cercana'
];

export const cie10List = [
  { c: 'H52.1', d: 'Miopía' }, { c: 'H52.2', d: 'Astigmatismo' }, { c: 'H52.0', d: 'Hipermetropía' },
  { c: 'H52.4', d: 'Presbicia' }, { c: 'H10', d: 'Conjuntivitis' }, { c: 'H26', d: 'Catarata' },
  { c: 'H40', d: 'Glaucoma' }, { c: 'H35.3', d: 'DMRE' }, { c: 'H04.1', d: 'Ojo seco' },
  { c: 'H18.6', d: 'Queratocono' }, { c: 'H50', d: 'Estrabismo' }, { c: 'H53.2', d: 'Diplopía' }
];

export const getStatusClass = (s) => {
  return s === 'completado' ? 'pill-done' : s === 'en proceso' ? 'pill-prog' : s === 'cancelado' ? 'pill-canc' : 'pill-pend';
};
