const data = window.MOVIMIENTO_CO_DATA;

/* =========================================================================
   1. CONFIGURACIÓN PRINCIPAL: PON AQUÍ TU WHATSAPP, REDES SOCIALES Y MEMES
   ========================================================================= */
const CONFIG_CAMPANA = {
  // Pon tu número de Perú con 51 adelante (sin espacios ni signo +):
  whatsappNumero: '51900585365',
  // Cómo quieres que se lea el número en la pantalla:
  whatsappVisible: '+51 900 585 365',

  // Enlaces oficiales de tus Redes Sociales (Cambia los links aquí):
  redes: {
    tiktok: 'https://www.tiktok.com/@movimiento._co',
    instagram: 'https://www.instagram.com/movimiento._co/',
    youtube: 'https://www.youtube.com/@MovimientoCo-CAO',
    twitter: 'https://x.com/MovimientoCO_'
  },

  // MEMES FIJOS INICIALES (Además, la página cargará automáticamente
  // cualquier imagen que guardes en assets/memes/meme-1.jpg hasta meme-20.jpg o .png):
  memesIniciales: [
    { src: 'assets/mascota-gato.jpg', titulo: '🔥 "¡Todos a votar por la mejor opción! ¡Marca C.O.!"' },
    { src: 'assets/mascota-perro.jpg', titulo: '🦸‍♂️ "Superperro del Centenario Olivarino llegando a trabajar por tu salón."' },
    { src: 'assets/meme-1.jpg', titulo: '😎 "Cuando ves que el Movimiento C.O. sí gestiona baños dignos y recreos chéveres."' },
    { src: 'assets/meme-2.jpg', titulo: '♟️ "Yo y mi salón listos para los Campeonatos Intersecciones y los Recreos Recreativos."' },
    { src: 'assets/meme-3.jpg', titulo: '🗳️ "¡No prometemos y desaparecemos! Este año el voto inteligente es C.O."' }
  ]
};

const state = {
  query: '',
  category: 'all',
  sort: 'number'
};

const els = {
  categorySelect: document.getElementById('categorySelect'),
  categoryRail: document.getElementById('categoryRail'),
  searchInput: document.getElementById('searchInput'),
  sortSelect: document.getElementById('sortSelect'),
  resultLine: document.getElementById('resultLine'),
  propuestasGrid: document.getElementById('propuestasGrid'),
  themeToggle: document.getElementById('themeToggle')
};

init();

function init() {
  initTheme();
  initWhatsappAndSocials();
  initRoadmapInteractive();
  initMemesGallery();

  if (data) {
    hydrateFilters();
    bindEvents();
    renderProposals();
  }

  initTabs();
  initVotingSimulator();
  initMemoryGame();
  initCatcherGame();
}

/* 2. MODO CLARO Y MODO OSCURO */
function initTheme() {
  const savedTheme = localStorage.getItem('movimiento_co_tema') || 'light';
  setTheme(savedTheme);

  if (els.themeToggle) {
    els.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }
}

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('movimiento_co_tema', mode);
  if (els.themeToggle) {
    els.themeToggle.textContent = mode === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro';
  }
}

/* 3. ENLACE DE WHATSAPP SIN ERROR 404 Y REDES SOCIALES */
function abrirWhatsappSeguro(mensajeTexto) {
  // Limpia cualquier signo +, espacio o guion para evitar el error 404 de WhatsApp:
  const numeroLimpio = String(CONFIG_CAMPANA.whatsappNumero || '').replace(/\D/g, '');
  const url = `https://api.whatsapp.com/send/?phone=${numeroLimpio}&text=${encodeURIComponent(mensajeTexto)}&type=phone_number&app_absent=0`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function initWhatsappAndSocials() {
  const visibleNum = document.getElementById('visibleWhatsappNumber');
  const sendBtn = document.getElementById('sendWhatsappBtn');
  const gradeInput = document.getElementById('waGrade');
  const msgInput = document.getElementById('waMessage');

  if (visibleNum) {
    visibleNum.textContent = CONFIG_CAMPANA.whatsappVisible;
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const grado = (gradeInput?.value || '').trim() || 'Anónimo';
      const propuesta = (msgInput?.value || '').trim();

      const textoFinal = propuesta
        ? `¡Hola Movimiento C.O.! 🗳️\nSoy de: ${grado}\nMi mensaje / propuesta para el colegio CAO es:\n"${propuesta}"`
        : `¡Hola Movimiento C.O.! 🗳️ Quiero enviar una propuesta al Buzón de Confianza del colegio CAO.`;

      abrirWhatsappSeguro(textoFinal);
    });
  }

  // Asignar links de Redes Sociales desde CONFIG_CAMPANA:
  const mapSocial = {
    linkTiktok: CONFIG_CAMPANA.redes.tiktok,
    linkInstagram: CONFIG_CAMPANA.redes.instagram,
    linkYoutube: CONFIG_CAMPANA.redes.youtube,
    linkTwitter: CONFIG_CAMPANA.redes.twitter
  };

  Object.entries(mapSocial).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
  });
}

/* 4. GENERADOR DE CLAVES INTERNAS ALEATORIAS VERIFICABLES POR GEMINI */
function generarClaveVerificable(tipoJuego) {
  // 20 consonantes específicas permitidas (Sin vocales A,E,I,O,U y sin Q):
  const alfabetoPermitido = 'BCDFGHJKLMNPRSTVWXYZ';
  let letras = '';
  let sumaPosiciones = 0;

  for (let i = 0; i < 4; i++) {
    const indice = Math.floor(Math.random() * alfabetoPermitido.length);
    letras += alfabetoPermitido[indice];
    sumaPosiciones += (indice + 1);
  }

  const baseOffset = tipoJuego === 'PAR15' ? 15 : 25;
  const codigoNumerico = sumaPosiciones + baseOffset;
  const letraControl = (codigoNumerico % 2 === 0) ? 'C' : 'X';

  return `CO-${tipoJuego}-${letras}-${codigoNumerico}${letraControl}`;
}

/* 5. SUBTEMA INTERACTIVO: RUTA DE TRABAJO PASO A PASO */
function initRoadmapInteractive() {
  const btns = document.querySelectorAll('.roadmap-btn');
  const display = document.getElementById('roadmapDisplay');
  if (!btns.length || !display) return;

  const etapas = {
    '1': {
      chip: 'Etapa 1 · Instalación Inmediata',
      titulo: 'Instalación del Buzón de Confianza y Diagnóstico de Baños',
      desc: 'Desde las primeras semanas colocaremos el Buzón de Confianza en un lugar accesible del colegio y recogeremos las opiniones de todas las secciones sobre las deficiencias urgentes de los servicios higiénicos.',
      puntos: [
        'Instalación física del Buzón de Confianza y apertura del Buzón por WhatsApp.',
        'Revisión del estado de los baños para presentar solicitudes de mantenimiento a la dirección.',
        'Primera reunión con los delegados de cada salón.'
      ]
    },
    '2': {
      chip: 'Etapa 2 · Gestión y Medio Ambiente',
      titulo: 'Campañas de Higiene y Jornadas de Más Áreas Verdes',
      desc: 'Gestionaremos con la dirección y los docentes las mejoras en los baños e iniciaremos la recuperación de los jardines del colegio junto a las secciones.',
      puntos: [
        'Campañas estudiantiles de cuidado y limpieza de los servicios higiénicos.',
        'Identificación de áreas para plantar flores y plantas ornamentales.',
        'Coordinación con cada sección para el cuidado ambiental.'
      ]
    },
    '3': {
      chip: 'Etapa 3 · Deporte y Recreación',
      titulo: 'Campeonatos Intersecciones y Recreos Recreativos',
      desc: 'En coordinación con los profesores de Educación Física y la dirección, lanzaremos el calendario deportivo y las actividades de entretenimiento en los recreos.',
      puntos: [
        'Inscripción de equipos por salón para fútbol, vóley y básquet con diplomas y medallas.',
        'Recreos con ajedrez, juegos de mesa, concursos de conocimientos, canto y baile.',
        'Actividades culturales para mostrar el talento Olivarino.'
      ]
    },
    '4': {
      chip: 'Etapa 4 · Municipio Presente Todo el Año',
      titulo: 'Visitas a las Aulas e Informes de Avances',
      desc: 'Porque "¡No prometemos y desaparecemos!", visitaremos periódicamente los salones para informar qué solicitudes ya se solucionaron y escuchar nuevas necesidades.',
      puntos: [
        'Visitas periódicas del Municipio Escolar salón por salón.',
        'Seguimiento constante a la lista de problemas más frecuentes.',
        'Publicación transparente de cada logro alcanzado para los estudiantes.'
      ]
    }
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const info = etapas[btn.dataset.step];
      if (!info) return;

      display.innerHTML = `
        <div class="roadmap-content">
          <span class="chip">${escapeHtml(info.chip)}</span>
          <h3>${escapeHtml(info.titulo)}</h3>
          <p>${escapeHtml(info.desc)}</p>
          <ul class="steps-list">
            ${info.puntos.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
          </ul>
        </div>
      `;
    });
  });
}

/* 6. FILTROS Y TARJETAS DE PROPUESTAS */
function hydrateFilters() {
  const options = [
    `<option value="all">Todas las categorías (${data.partido.totalPropuestas})</option>`,
    ...data.categories.map(cat => `<option value="${escapeAttr(cat.id)}">${cat.icon} ${escapeHtml(cat.title)}</option>`)
  ];
  els.categorySelect.innerHTML = options.join('');

  els.categoryRail.innerHTML = [
    railButton('all', '🔥', 'Todas', data.partido.totalPropuestas),
    ...data.categories.map(cat => railButton(cat.id, cat.icon, cat.title, cat.propuestas.length))
  ].join('');

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.category;
      els.categorySelect.value = state.category;
      renderProposals();
    });
  });
}

function bindEvents() {
  els.searchInput.addEventListener('input', () => {
    state.query = els.searchInput.value.trim().toLowerCase();
    renderProposals();
  });

  els.categorySelect.addEventListener('change', () => {
    state.category = els.categorySelect.value;
    renderProposals();
  });

  els.sortSelect.addEventListener('change', () => {
    state.sort = els.sortSelect.value;
    renderProposals();
  });
}

function renderProposals() {
  const proposals = getFilteredProposals();
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === state.category);
  });

  els.resultLine.textContent = `Mostrando ${proposals.length} propuesta(s) del Movimiento C.O.`;

  if (!proposals.length) {
    els.propuestasGrid.innerHTML = `<article class="propuesta-card"><h3>Sin resultados</h3><p>Prueba buscando otra palabra clave.</p></article>`;
    return;
  }

  els.propuestasGrid.innerHTML = proposals.map(proposalCard).join('');
}

function getFilteredProposals() {
  const all = data.categories.flatMap(category =>
    category.propuestas.map(item => ({ ...item, categoryMeta: category }))
  );

  const filtered = all.filter(item => {
    const inCategory = state.category === 'all' || item.category === state.category;
    if (!inCategory) return false;
    if (!state.query) return true;

    const haystack = [
      item.name,
      item.lema,
      item.concept,
      item.objective,
      item.categoryMeta.title,
      ...(item.steps || []),
      ...(item.keywords || [])
    ].join(' ').toLowerCase();

    return haystack.includes(state.query);
  });

  filtered.sort((a, b) => {
    if (state.sort === 'name') return a.name.localeCompare(b.name, 'es');
    return (a.number || 0) - (b.number || 0);
  });

  return filtered;
}

function proposalCard(item) {
  const meta = item.categoryMeta;
  const stepsHtml = (item.steps || [])
    .map(step => `<li>${escapeHtml(step)}</li>`)
    .join('');

  return `
    <article class="propuesta-card">
      <div class="propuesta-card-top">
        <span class="category-label">${escapeHtml(meta.icon)} Propuesta N.º ${item.number} · ${escapeHtml(meta.title)}</span>
        <img src="assets/logo-co.jpg" alt="CO" onerror="this.src='https://placehold.co/60x60/ff6200/ffffff?text=CO'">
      </div>
      <h3>${escapeHtml(item.name)}</h3>
      <span class="lema-badge">Lema: "${escapeHtml(item.lema)}"</span>
      <p><strong>Concepto:</strong> ${escapeHtml(item.concept)}</p>
      <strong>¿Cómo lo realizaremos?</strong>
      <ul class="steps-list">${stepsHtml}</ul>
      <div class="tip"><strong>🎯 Objetivo:</strong> ${escapeHtml(item.objective)}</div>
    </article>
  `;
}

function railButton(id, icon, title, count) {
  return `<button class="cat-btn ${id === state.category ? 'active' : ''}" data-category="${escapeAttr(id)}">${escapeHtml(icon)} ${escapeHtml(title)} (${count})</button>`;
}

/* 7. PESTAÑAS DE JUEGOS Y VOTO */
function initTabs() {
  const tabs = document.querySelectorAll('.interactivo-tab');
  const contents = {
    memoria: document.getElementById('memoriaTab'),
    catcher: document.getElementById('catcherTab'),
    voto: document.getElementById('votoTab')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      Object.keys(contents).forEach(key => {
        if (contents[key]) {
          contents[key].style.display = key === tab.dataset.tab ? 'block' : 'none';
        }
      });
    });
  });
}

/* 8. JUEGO 1: MEMORIA ELECTORAL C.O. (LOGRO A LAS 15 VICTORIAS SEGUIDAS) */
function initMemoryGame() {
  const board = document.getElementById('memoryBoard');
  const pairsEl = document.getElementById('memoryPairs');
  const movesEl = document.getElementById('memoryMoves');
  const streakEl = document.getElementById('memoryStreak');
  const statusEl = document.getElementById('memoryStatus');
  const restartBtn = document.getElementById('restartMemoryBtn');
  const rewardBox = document.getElementById('memoryRewardBox');
  const secretKeyEl = document.getElementById('memorySecretKey');
  const claimBtn = document.getElementById('claimMemoryWhatsappBtn');
  if (!board) return;

  const MAX_MOVES = 18;
  let streak = Number(localStorage.getItem('co_memory_streak') || 0);
  let savedKey = localStorage.getItem('co_memory_key') || '';

  const baseCards = [
    { id: 'logo', label: 'Logo C.O.', img: 'assets/logo-co.jpg', fallback: 'https://placehold.co/90x90/ffffff/ff6200?text=CO' },
    { id: 'perro', label: 'Mascota Perro', img: 'assets/mascota-perro.jpg', fallback: 'https://placehold.co/90x90/ff6200/ffffff?text=Perro' },
    { id: 'gato', label: 'Mascota Gato', img: 'assets/mascota-gato.jpg', fallback: 'https://placehold.co/90x90/ff6200/ffffff?text=Gato' },
    { id: 'cao', label: 'Insignia CAO', img: 'assets/insignia-cao.png', fallback: 'https://placehold.co/90x90/002b7f/ffffff?text=CAO' },
    { id: 'deporte', label: 'Campeonatos 🏆', icon: '🏆' },
    { id: 'verde', label: 'Áreas Verdes 🌱', icon: '🌱' }
  ];

  let deck = [];
  let flipped = [];
  let matchedCount = 0;
  let moves = 0;
  let lock = false;

  function updateStreakUI() {
    streakEl.textContent = `${streak} / 15`;
    if (streak >= 15) {
      if (!savedKey) {
        savedKey = generarClaveVerificable('PAR15');
        localStorage.setItem('co_memory_key', savedKey);
      }
      secretKeyEl.textContent = savedKey;
      rewardBox.style.display = 'block';
    }
  }

  function setupGame() {
    deck = [...baseCards, ...baseCards].sort(() => Math.random() - 0.5);
    flipped = [];
    matchedCount = 0;
    moves = 0;
    lock = false;
    pairsEl.textContent = '0 / 6';
    movesEl.textContent = `0 / ${MAX_MOVES}`;
    updateStreakUI();
    statusEl.textContent = `¡Completa las 6 parejas en máximo ${MAX_MOVES} intentos para sumar +1 a tu racha seguida!`;
    renderBoard();
  }

  function renderBoard() {
    board.innerHTML = deck.map((card, index) => `
      <button type="button" class="memory-card" data-index="${index}">
        <div class="card-content">🐾 C.O.</div>
      </button>
    `).join('');

    board.querySelectorAll('.memory-card').forEach(btn => {
      btn.addEventListener('click', () => flipCard(btn));
    });
  }

  function flipCard(btn) {
    const idx = Number(btn.dataset.index);
    if (lock || btn.classList.contains('flipped') || btn.classList.contains('matched')) return;

    const item = deck[idx];
    btn.classList.add('flipped');
    btn.innerHTML = item.img
      ? `<img src="${item.img}" alt="${item.label}" onerror="this.src='${item.fallback}'"><span>${item.label}</span>`
      : `<div style="font-size:38px;">${item.icon}</div><span>${item.label}</span>`;

    flipped.push({ idx, btn, id: item.id });

    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = `${moves} / ${MAX_MOVES}`;
      lock = true;

      if (flipped[0].id === flipped[1].id) {
        flipped[0].btn.classList.add('matched');
        flipped[1].btn.classList.add('matched');
        matchedCount++;
        pairsEl.textContent = `${matchedCount} / 6`;
        flipped = [];
        lock = false;

        if (matchedCount === 6) {
          streak++;
          localStorage.setItem('co_memory_streak', String(streak));
          updateStreakUI();
          statusEl.textContent = `🎉 ¡Ganaste esta partida en ${moves} intentos! Racha seguida actual: ${streak} / 15.`;
        }
      } else {
        setTimeout(() => {
          flipped.forEach(f => {
            f.btn.classList.remove('flipped');
            f.btn.innerHTML = `<div class="card-content">🐾 C.O.</div>`;
          });
          flipped = [];

          if (moves >= MAX_MOVES && matchedCount < 6) {
            streak = 0;
            localStorage.setItem('co_memory_streak', '0');
            updateStreakUI();
            statusEl.textContent = '⚠️ Te quedaste sin intentos y tu racha volvió a 0. ¡Presiona "Jugar Ronda" para intentarlo de nuevo!';
            lock = true;
          } else {
            lock = false;
          }
        }, 700);
      }
    }
  }

  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      const msg = `¡Hola Movimiento C.O.! 🏆 Gané 15 veces seguidas en el juego de Pares C.O.\nMi Clave Secreta es: *${savedKey}*\nAquí adjunto mi captura de pantalla para el Regalo Digital Misterioso:`;
      abrirWhatsappSeguro(msg);
    });
  }

  restartBtn.addEventListener('click', setupGame);
  setupGame();
}

/* 9. JUEGO 2: ATRAPA LAS MEJORAS DEL CAO (LOGRO A LOS 250 PUNTOS) */
function initCatcherGame() {
  const canvas = document.getElementById('coGameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('gameScore');
  const livesEl = document.getElementById('gameLives');
  const startBtn = document.getElementById('startGameBtn');
  const leftBtn = document.getElementById('leftTouchBtn');
  const rightBtn = document.getElementById('rightTouchBtn');
  const rewardBox = document.getElementById('catcherRewardBox');
  const secretKeyEl = document.getElementById('catcherSecretKey');
  const claimBtn = document.getElementById('claimCatcherWhatsappBtn');

  let running = false;
  let score = 0;
  let lives = 3;
  let playerX = 250;
  const playerW = 104;
  let items = [];
  let moveDir = 0;
  let savedCatcherKey = localStorage.getItem('co_catcher_key') || '';

  if (savedCatcherKey) {
    secretKeyEl.textContent = savedCatcherKey;
    rewardBox.style.display = 'block';
  }

  const goodIcons = ['📬', '⚽', '🧼', '🌱', '🎲'];
  const badIcons = ['🗑️', '❌'];

  function unlockCatcherAchievement() {
    if (!savedCatcherKey) {
      savedCatcherKey = generarClaveVerificable('ATR250');
      localStorage.setItem('co_catcher_key', savedCatcherKey);
    }
    secretKeyEl.textContent = savedCatcherKey;
    rewardBox.style.display = 'block';
  }

  function spawnItem() {
    const isGood = Math.random() > 0.26;
    const list = isGood ? goodIcons : badIcons;
    items.push({
      x: Math.random() * (canvas.width - 36) + 18,
      y: -20,
      speed: 2.3 + Math.random() * 2.1 + Math.min(2.5, score * 0.008),
      good: isGood,
      icon: list[Math.floor(Math.random() * list.length)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0e0703';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    playerX = Math.max(0, Math.min(canvas.width - playerW, playerX + moveDir * 6.5));
    ctx.fillStyle = '#ff6200';
    ctx.fillRect(playerX, canvas.height - 34, playerW, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VOTA C.O.', playerX + playerW / 2, canvas.height - 19);

    ctx.font = '26px sans-serif';
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;
      ctx.fillText(it.icon, it.x, it.y);

      if (it.y >= canvas.height - 40 && it.y <= canvas.height - 10 &&
          it.x >= playerX - 10 && it.x <= playerX + playerW + 10) {
        if (it.good) {
          score += 10;
          if (score >= 250) {
            unlockCatcherAchievement();
          }
        } else {
          lives -= 1;
        }
        items.splice(i, 1);
        updateHUD();
        continue;
      }

      if (it.y > canvas.height + 20) {
        items.splice(i, 1);
      }
    }

    if (lives <= 0) {
      running = false;
      ctx.fillStyle = 'rgba(0,0,0,0.84)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff6200';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('¡FIN DE LA PARTIDA!', canvas.width / 2, canvas.height / 2 - 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Puntaje alcanzado: ${score} pts`, canvas.width / 2, canvas.height / 2 + 14);
      if (score >= 250) {
        ctx.fillStyle = '#25d366';
        ctx.fillText(`¡META DE 250 PTS SUPERADA! Clave: ${savedCatcherKey}`, canvas.width / 2, canvas.height / 2 + 44);
      }
      startBtn.textContent = '🔄 Jugar Otra Vez';
      return;
    }

    if (running) {
      if (Math.random() < 0.045) spawnItem();
      requestAnimationFrame(draw);
    }
  }

  function updateHUD() {
    scoreEl.textContent = String(score);
    livesEl.textContent = '❤️'.repeat(Math.max(0, lives)) || '💀';
  }

  startBtn.addEventListener('click', () => {
    score = 0;
    lives = 3;
    items = [];
    running = true;
    updateHUD();
    startBtn.textContent = '⚡ Jugando...';
    draw();
  });

  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      const msg = `¡Hola Movimiento C.O.! 🎯 Llegué a los 250+ puntos en Atrapa las Mejoras del CAO.\nMi Clave Secreta es: *${savedCatcherKey}*\nAquí adjunto mi captura de pantalla con mi puntaje y clave:`;
      abrirWhatsappSeguro(msg);
    });
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') moveDir = -1;
    if (e.key === 'ArrowRight') moveDir = 1;
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') moveDir = 0;
  });

  const movePointer = clientX => {
    const rect = canvas.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * canvas.width;
    playerX = Math.max(0, Math.min(canvas.width - playerW, relX - playerW / 2));
  };
  canvas.addEventListener('mousemove', e => movePointer(e.clientX));
  canvas.addEventListener('touchmove', e => {
    if (e.touches[0]) movePointer(e.touches[0].clientX);
  }, { passive: true });

  leftBtn.addEventListener('touchstart', () => { moveDir = -1; }, { passive: true });
  leftBtn.addEventListener('touchend', () => { moveDir = 0; });
  leftBtn.addEventListener('mousedown', () => { moveDir = -1; });
  leftBtn.addEventListener('mouseup', () => { moveDir = 0; });

  rightBtn.addEventListener('touchstart', () => { moveDir = 1; }, { passive: true });
  rightBtn.addEventListener('touchend', () => { moveDir = 0; });
  rightBtn.addEventListener('mousedown', () => { moveDir = 1; });
  rightBtn.addEventListener('mouseup', () => { moveDir = 0; });

  draw();
}

/* 10. SIMULADOR DE VOTO */
function initVotingSimulator() {
  const ballotCard = document.getElementById('ballotCard');
  const voteCounterText = document.getElementById('voteCounterText');
  const voteStatusMsg = document.getElementById('voteStatusMsg');
  if (!ballotCard) return;

  let votes = Number(localStorage.getItem('co_votes_count') || 150);
  let hasVoted = localStorage.getItem('co_has_voted') === 'true';

  const updateVoteUI = () => {
    voteCounterText.innerHTML = `🔥 <b>${votes}</b> estudiantes ya practicaron su voto por C.O.`;
    if (hasVoted) {
      ballotCard.classList.add('voted');
      voteStatusMsg.textContent = '✅ ¡Voto marcado por el Movimiento C.O.! ¡El cambio comienza contigo!';
    }
  };
  updateVoteUI();

  ballotCard.addEventListener('click', () => {
    if (!hasVoted) {
      votes++;
      hasVoted = true;
      localStorage.setItem('co_votes_count', String(votes));
      localStorage.setItem('co_has_voted', 'true');
      updateVoteUI();
    } else {
      voteStatusMsg.textContent = '🎉 ¡Gracias por apoyar al Movimiento C.O.!';
    }
  });
}

/* 11. GALERÍA AUTOMÁTICA DE MEMES + DETECTOR DE CARPETA assets/memes/ */
function initMemesGallery() {
  const grid = document.getElementById('memesGrid');
  const lightbox = document.getElementById('memeLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightboxBtn');
  if (!grid) return;

  const addedUrls = new Set();

  function addMemeCard(src, titulo, fallbackUrl) {
    if (addedUrls.has(src)) return;
    addedUrls.add(src);

    const fig = document.createElement('figure');
    fig.className = 'meme-card';

    const img = document.createElement('img');
    img.src = src;
    img.alt = titulo;
    if (fallbackUrl) {
      img.onerror = () => { img.src = fallbackUrl; };
    }

    const cap = document.createElement('figcaption');
    cap.textContent = titulo;

    fig.appendChild(img);
    fig.appendChild(cap);

    fig.addEventListener('click', () => {
      if (!lightbox) return;
      lightboxImg.src = img.src;
      lightboxCaption.textContent = titulo;
      lightbox.style.display = 'flex';
    });

    grid.appendChild(fig);
  }

  // 1. Cargar los memes iniciales configurados en CONFIG_CAMPANA:
  CONFIG_CAMPANA.memesIniciales.forEach((m, idx) => {
    addMemeCard(
      m.src,
      m.titulo,
      `https://placehold.co/600x500/fff3e6/ff6200?text=MEME+CO+${idx + 1}`
    );
  });

  // 2. Detector automático de la carpeta assets/memes/ (meme-1 hasta meme-20 en .jpg o .png):
  for (let i = 1; i <= 20; i++) {
    ['jpg', 'png', 'jpeg', 'webp'].forEach(ext => {
      const candidatePath = `assets/memes/meme-${i}.${ext}`;
      const probe = new Image();
      probe.onload = () => {
        addMemeCard(candidatePath, `😂 Meme Olivarino C.O. #${i} · ¡Vota por la mejor opción!`, null);
      };
      probe.src = candidatePath;
    });
  }

  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) lightbox.style.display = 'none';
    });
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}
