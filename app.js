(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);

  const PROJECTS = [
    { id: 'py1', cat: 'python', c: '#4ECDC4', img: 'project-python-1', title: 'Proyecto Python 1', desc: 'Descripción breve del proyecto Python 1.', long: 'Generador de fractales de Mandelbrot con NumPy: cálculo vectorizado, paletas por bandas y exportación a imagen.', stack: ['Python', 'NumPy', 'Pillow'] },
    { id: 'css1', cat: 'css', c: '#FFDB58', img: 'project-css-1', title: 'Proyecto CSS 1', desc: 'Descripción breve del proyecto CSS 1.', long: 'Patrones Truchet generados solo con CSS Grid y arcos, sin imágenes: un fondo infinito y ligero.', stack: ['CSS Grid', 'Custom properties'] },
    { id: 'html1', cat: 'html', c: '#FF6B6B', img: 'project-html-1', title: 'Proyecto HTML 1', desc: 'Descripción breve del proyecto HTML 1.', long: 'Landing semántica y accesible con diagrama de Voronoi en SVG, navegación por teclado y buen puntaje en Lighthouse.', stack: ['HTML5', 'SVG', 'A11y'] },
    { id: 'py2', cat: 'python', c: '#4ECDC4', img: 'project-python-2', title: 'Proyecto Python 2', desc: 'Descripción breve del proyecto Python 2.', long: 'Visualizador de curvas de Lissajous con controles de frecuencia y fase, exportable a PNG y GIF.', stack: ['Python', 'Matplotlib'] },
    { id: 'css2', cat: 'css', c: '#FFDB58', img: 'project-css-2', title: 'Proyecto CSS 2', desc: 'Descripción breve del proyecto CSS 2.', long: 'Sistema de componentes estilo Bauhaus: botones, tarjetas y grillas con una paleta de cuatro colores.', stack: ['CSS', 'Design tokens'] },
    { id: 'html2', cat: 'html', c: '#FF6B6B', img: 'project-html-2', title: 'Proyecto HTML 2', desc: 'Descripción breve del proyecto HTML 2.', long: 'Página de evento con secciones onduladas en SVG, formulario de registro y diseño responsive.', stack: ['HTML5', 'SVG', 'Forms'] },
  ];
  const INITIAL = 3;
  let filter = 'all';
  let showAll = false;

  $('year').textContent = new Date().getFullYear();

  // Typed role
  const roles = ['Desarrollador Web', 'Frontend Developer', 'Maquetador responsive', 'Pythonista curioso'];
  const roleEl = $('role');
  if (!reduce) {
    let r = 0; let ch = roles[0].length; let del = true;
    const type = () => {
      const word = roles[r];
      ch += del ? -1 : 1;
      roleEl.textContent = word.slice(0, ch);
      if (del && ch === 0) { del = false; r = (r + 1) % roles.length; }
      else if (!del && ch === roles[r].length) { del = true; setTimeout(type, 1800); return; }
      setTimeout(type, del ? 35 : 70);
    };
    setTimeout(type, 2200);
  }

  // Projects
  const grid = $('projects');
  const viewAll = $('view-all-projects');
  const render = () => {
    const list = PROJECTS.filter((p) => filter === 'all' || p.cat === filter);
    const visible = showAll || filter !== 'all' ? list : list.slice(0, INITIAL);
    grid.innerHTML = visible.map((p, i) => `<div class="col-md-6 col-lg-4"><article class="pcard" style="animation-delay:${i * 70}ms">
      <img src="assets/${p.img}.webp" alt="Miniatura de ${p.title}" width="600" height="400" loading="lazy">
      <div class="pcard-body"><span class="ptag" style="--c:${p.c}">${p.cat}</span><h3>${p.title}</h3><p>${p.desc}</p>
      <button class="brut-btn" type="button" data-open="${p.id}">Ver más <i class="bi bi-arrow-right"></i></button></div></article></div>`).join('');
    viewAll.hidden = showAll || filter !== 'all' || list.length <= INITIAL;
  };
  document.querySelector('.filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]'); if (!b) return;
    filter = b.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((x) => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    render();
  });
  viewAll.addEventListener('click', () => { showAll = true; render(); });
  render();

  // Project dialog
  const dlg = $('project-dialog');
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    const p = PROJECTS.find((x) => x.id === b.dataset.open);
    $('pd-img').src = `assets/${p.img}.webp`; $('pd-img').alt = `Imagen de ${p.title}`;
    $('pd-tag').textContent = p.cat; $('pd-tag').style.setProperty('--c', p.c);
    $('pd-title').textContent = p.title; $('pd-desc').textContent = p.long;
    $('pd-stack').innerHTML = p.stack.map((s) => `<li>${s}</li>`).join('');
    dlg.showModal();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });

  // Copy to clipboard
  const toast = (msg) => {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 2000);
  };
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast('¡Copiado! ✓'); }
    catch (e) { toast(b.dataset.copy); }
  }));

  // CV: print the page (print stylesheet turns it into a clean CV / PDF)
  document.querySelectorAll('[data-print]').forEach((b) => b.addEventListener('click', () => {
    const was = showAll; showAll = true; filter = 'all'; render();
    window.print();
    showAll = was; render();
  }));

  // Reveal + count-up
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (reduce) { el.textContent = target.toLocaleString('es'); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('es');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visible');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);
    }), { threshold: 0.2 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });
  } else {
    reveals.forEach((el) => { el.classList.add('visible'); el.querySelectorAll('[data-count]').forEach(countUp); });
  }

  // Mobile menu closes after navigating
  const menu = $('menu');
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a') && menu.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });

  // Back to top
  const topBtn = $('btn-back-to-top');
  const onScroll = () => topBtn.classList.toggle('show', window.scrollY > 400);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
})();
