/* =============================================
   Santi-Move — Simulador de movilidad urbana
   Santiago de los Caballeros, RD
   app.js
   ============================================= */

// ── Base de datos de rutas ──────────────────────
const DB = {
  gurabo_uapa: {
    t: 28, c: 55, co2: 1.1,
    steps: [
      { txt: 'Camina 4 min hasta parada Gurabo (Calle del Sol)', tipo: 'walk' },
      { txt: 'Concho ruta Gurabo–Centro · 12 min · RD$25', tipo: 'concho' },
      { txt: 'Trasborda Monorriel Est. Centro · plataforma A', tipo: 'transfer' },
      { txt: 'Monorriel directo a Est. UAPA · 8 min · RD$30', tipo: 'mono' },
      { txt: 'Camina 4 min a edificio UAPA', tipo: 'walk' }
    ],
    edu: 'Zona escolar activa — Colegio Loyola en ruta. Ceda el paso a peatones en Av. Hispanoamérica.',
    mapO: { x: 55, y: 175 }, mapD: { x: 420, y: 85 }
  },
  gurabo_mall: {
    t: 32, c: 60, co2: 1.3,
    steps: [
      { txt: 'Camina 3 min a parada Gurabo', tipo: 'walk' },
      { txt: 'Concho ruta Gurabo–Centro · 12 min · RD$25', tipo: 'concho' },
      { txt: 'Trasborda concho ruta Francia · 8 min · RD$25', tipo: 'concho' },
      { txt: 'Baja y camina 12 min a Mall Las Palmas', tipo: 'walk' }
    ],
    edu: 'Usa Av. Francia para evitar obras en Las Carreras. Ruta alterna activa hoy.',
    mapO: { x: 55, y: 175 }, mapD: { x: 380, y: 190 }
  },
  sajoma_uapa: {
    t: 35, c: 65, co2: 1.4,
    steps: [
      { txt: 'Camina 3 min a parada Los Jardines', tipo: 'walk' },
      { txt: 'Concho ruta Sajoma–Centro · 15 min · RD$25', tipo: 'concho' },
      { txt: 'Trasborda Monorriel Est. Centro · plataforma A', tipo: 'transfer' },
      { txt: 'Monorriel a Est. UAPA · 10 min · RD$30', tipo: 'mono' },
      { txt: 'Camina 3 min al destino', tipo: 'walk' }
    ],
    edu: 'Recuerda ceder el asiento a personas mayores y mujeres embarazadas en el transporte público.',
    mapO: { x: 40, y: 200 }, mapD: { x: 420, y: 85 }
  },
  centro_uapa: {
    t: 22, c: 45, co2: 0.9,
    steps: [
      { txt: 'Camina 1 min a Est. Monorriel Centro', tipo: 'walk' },
      { txt: 'Monorriel directo Est. Centro → Est. UAPA · 18 min · RD$30', tipo: 'mono' },
      { txt: 'Camina 3 min desde Est. UAPA al edificio', tipo: 'walk' }
    ],
    edu: 'La tarjeta Monorriel acumula puntos EduVial. ¡Usa el transporte público y gana beneficios!',
    mapO: { x: 180, y: 100 }, mapD: { x: 420, y: 85 }
  },
  centro_alcaldia: {
    t: 18, c: 35, co2: 0.7,
    steps: [
      { txt: 'Camina 5 min a parada Centro', tipo: 'walk' },
      { txt: 'Concho ruta Centro–Alcaldía · 10 min · RD$25', tipo: 'concho' },
      { txt: 'Llega a Alcaldía de Santiago', tipo: 'walk' }
    ],
    edu: 'Conoce tus derechos viales. La Alcaldía ofrece talleres gratuitos de educación vial los viernes.',
    mapO: { x: 180, y: 100 }, mapD: { x: 260, y: 140 }
  },
  pekin_uapa: {
    t: 25, c: 50, co2: 1.0,
    steps: [
      { txt: 'Camina 4 min a parada Barrio Pekín', tipo: 'walk' },
      { txt: 'Concho Pekín–Centro · 10 min · RD$25', tipo: 'concho' },
      { txt: 'Trasborda Monorriel Est. Centro', tipo: 'transfer' },
      { txt: 'Monorriel a Est. UAPA · 8 min · RD$30', tipo: 'mono' },
      { txt: 'Camina 3 min al destino', tipo: 'walk' }
    ],
    edu: 'El trayecto por Av. 27 de Febrero puede tener tapones en horas pico. Salga con 10 min de margen.',
    mapO: { x: 110, y: 65 }, mapD: { x: 420, y: 85 }
  },
  villa_monumento: {
    t: 15, c: 30, co2: 0.6,
    steps: [
      { txt: 'Camina 2 min a Est. Villa Olímpica', tipo: 'walk' },
      { txt: 'Monorriel a Est. Centro · 10 min · RD$30', tipo: 'mono' },
      { txt: 'Camina 5 min al Monumento', tipo: 'walk' }
    ],
    edu: 'El Monumento a los Héroes es zona peatonal prioritaria. Respeta los pasos cebra.',
    mapO: { x: 460, y: 180 }, mapD: { x: 245, y: 100 }
  },
  default: {
    t: 30, c: 55, co2: 1.0,
    steps: [
      { txt: 'Camina a la parada más cercana · 5 min', tipo: 'walk' },
      { txt: 'Concho hacia el Centro · ~12 min · RD$25', tipo: 'concho' },
      { txt: 'Trasborda según destino · ~10 min', tipo: 'transfer' },
      { txt: 'Camina al punto de destino · ~5 min', tipo: 'walk' }
    ],
    edu: 'Planifica tu ruta con anticipación. Salir 10 minutos antes reduce el estrés del tránsito diario.',
    mapO: { x: 80, y: 185 }, mapD: { x: 390, y: 85 }
  }
};

// ── Paletas de colores por tipo de paso ─────────
const COLORS = { walk: '#1D9E75', concho: '#BA7517', mono: '#A32D2D', transfer: '#185FA5' };
const LABELS = { walk: 'A pie', concho: 'Concho', mono: 'Monorriel', transfer: 'Trasbordo' };
const BG     = { walk: '#E1F5EE', concho: '#FAEEDA', mono: '#FCEBEB', transfer: '#E6F1FB' };
const TC     = { walk: '#085041', concho: '#633806', mono: '#791F1F', transfer: '#0C447C' };

// ── Estado global ────────────────────────────────
let mode = 'multi';

// ── Selección de modo de viaje ───────────────────
function setMode(m, el) {
  mode = m;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ── Toggle de checkboxes ─────────────────────────
function toggleCheck(row) {
  const box = row.querySelector('.check-box');
  box.classList.toggle('checked');
}

// ── Swap Origen ↔ Destino ────────────────────────
function swapOD() {
  const o = document.getElementById('origen');
  const d = document.getElementById('destino');
  const tmp = o.value;
  o.value = d.value;
  d.value = tmp;
}

// ── Toast de notificación ────────────────────────
function reportar(msg) {
  const t = document.getElementById('toast');
  t.textContent = '✓ ' + msg + ' — gracias por contribuir a Santi-Move';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Búsqueda de ruta principal ───────────────────
function buscar() {
  const o = document.getElementById('origen').value;
  const d = document.getElementById('destino').value;

  if (!o || !d) {
    reportar('Selecciona origen y destino primero');
    return;
  }

  // Buscar ruta en la DB (clave compuesta, clave parcial o default)
  let key = o + '_' + d;
  let data = DB[key] || DB[o + '_' + d.substring(0, 4)] || DB['default'];
  let { t, c, co2, steps, edu, mapO, mapD } = JSON.parse(JSON.stringify(data));

  // Ajustes según modo de viaje
  if (mode === 'concho') {
    t += 6;
    c -= 15;
    co2 -= 0.2;
    steps = steps.filter(s => s.tipo !== 'mono');
    steps = steps.filter(s => s.tipo !== 'transfer');
  }
  if (mode === 'mono') {
    t -= 4;
    c += 10;
    steps = steps.filter(s => s.tipo !== 'concho');
    if (!steps.find(s => s.tipo === 'mono')) {
      steps.splice(1, 0, { txt: 'Monorriel desde Est. cercana · RD$30', tipo: 'mono' });
    }
  }

  co2 = Math.max(0.3, co2);

  // ── Actualizar estadísticas ──
  document.getElementById('s-tiempo').textContent = t;
  document.getElementById('s-costo').textContent  = c;
  document.getElementById('s-co2').textContent    = co2.toFixed(1);
  document.getElementById('co2-tag').textContent  = co2.toFixed(1) + ' kg CO₂ ahorrado';
  document.getElementById('co2-fill').style.width = Math.min(100, Math.round(co2 / 1.8 * 100)) + '%';
  document.getElementById('edu-text').textContent = edu;

  // ── Renderizar pasos del itinerario ──
  const sl = document.getElementById('step-list');
  sl.innerHTML = '';
  steps.forEach((s, i) => {
    const isLast = i === steps.length - 1;
    const item = document.createElement('div');
    item.className = 'step-item';
    item.innerHTML = `
      <div class="step-track">
        <div class="step-dot" style="background:${COLORS[s.tipo] || '#888'}"></div>
        ${isLast ? '' : '<div class="step-vline"></div>'}
      </div>
      <div class="step-body">
        <div class="step-text">${s.txt}</div>
        <span class="step-badge" style="background:${BG[s.tipo]};color:${TC[s.tipo]}">
          ${LABELS[s.tipo] || s.tipo}
        </span>
      </div>`;
    sl.appendChild(item);
  });

  // ── Actualizar mapa SVG ──
  const mo = mapO || { x: 80, y: 185 };
  const md = mapD || { x: 390, y: 85 };
  const mx = (mo.x + md.x) / 2;
  const my = (mo.y + md.y) / 2;

  const setAttr = (id, cx, cy) => {
    document.getElementById(id).setAttribute('cx', cx);
    document.getElementById(id).setAttribute('cy', cy);
  };

  setAttr('pin-o',       mo.x, mo.y);
  setAttr('pin-o-inner', mo.x, mo.y);
  setAttr('pin-d',       md.x, md.y);
  setAttr('pin-d-inner', md.x, md.y);

  const lo = document.getElementById('lbl-o');
  lo.setAttribute('x', mo.x + 12);
  lo.setAttribute('y', mo.y - 10);
  lo.textContent = document.getElementById('origen').options[
    document.getElementById('origen').selectedIndex
  ].text.slice(0, 12);

  const ld = document.getElementById('lbl-d');
  ld.setAttribute('x', md.x + 12);
  ld.setAttribute('y', md.y - 10);
  ld.textContent = document.getElementById('destino').options[
    document.getElementById('destino').selectedIndex
  ].text.slice(0, 12);

  // Trazar segmentos de la ruta
  document.getElementById('r-walk1').setAttribute('points',  `${mo.x},${mo.y} ${mo.x + 28},${mo.y - 18}`);
  document.getElementById('r-concho').setAttribute('points', `${mo.x + 28},${mo.y - 18} ${mx},${my}`);
  document.getElementById('r-mono').setAttribute('points',   `${mx},${my} ${md.x - 25},${md.y + 18}`);
  document.getElementById('r-walk2').setAttribute('points',  `${md.x - 25},${md.y + 18} ${md.x},${md.y}`);

  // Mostrar resultados
  document.getElementById('placeholder').style.display = 'none';
  const rc = document.getElementById('results-content');
  rc.style.display       = 'flex';
  rc.style.flexDirection = 'column';
  rc.style.gap           = '12px';
}
