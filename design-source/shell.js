// Shared shell for Impulso BioCycle views. Renders sidebar + topbar.
// Usage: <body data-view="descubrimientos"> then include this script at end.

(function(){
  const VIEWS = [
    {id:'inicio',          name:'Inicio',                file:'Inicio.html',           kbd:'1', icon:'<path d="M3 12l9-8 9 8M5 10v10h14V10"/>'},
    {id:'descubrimientos', name:'Descubrimientos',       file:'Descubrimientos.html',  kbd:'2', icon:'<path d="M4 19.5V4.5A1.5 1.5 0 015.5 3H19v18H5.5A1.5 1.5 0 014 19.5zM8 7h8M8 11h8M8 15h5"/>'},
    {id:'disenador',       name:'Construye tu Consorcio',file:'Disenador.html',        kbd:'3', icon:'<path d="M7 2v4a5 5 0 0010 0V2M7 22v-4a5 5 0 0110 0v4M7 6h10M7 18h10"/>'},
    {id:'portal',          name:'Gestiona tus Residuos', file:'Portal.html',           kbd:'4', icon:'<path d="M3 21h18M5 21V7l7-4 7 4v14M10 10h4M10 14h4M10 18h4"/>'},
    {id:'asesoria',        name:'Asesoría IA',           file:'Asesoria.html',         kbd:'5', icon:'<path d="M21 12a8 8 0 11-3.2-6.4L21 3v6h-6"/><circle cx="12" cy="12" r="2.5"/>'}
  ];
  const cur = document.body.dataset.view || 'inicio';
  const crumb = document.body.dataset.crumb || (VIEWS.find(v=>v.id===cur)||{}).name || '';

  const navHTML = VIEWS.map(v => `
    <a class="nav-item ${v.id===cur?'active':''}" href="${v.file}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${v.icon}</svg>
      ${v.name}
      <span class="nav-kbd">${v.kbd}</span>
    </a>`).join('');

  const sidebar = `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true"></div>
        <div>
          <div class="brand-name">Impulso <span style="color:var(--forest-deep)">BioCycle</span></div>
          <div class="brand-sub">v0.3 · Piloto</div>
        </div>
      </div>
      <div class="nav-label">Producto</div>
      <nav class="nav">${navHTML}</nav>
      <div class="nav-label" style="margin-top:18px">Recursos</div>
      <nav class="nav">
        <a class="nav-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5"/></svg>Corpus (61 docs)</a>
        <a class="nav-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>30+ países</a>
        <a class="nav-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 8v5l3 2M3 12a9 9 0 1018 0 9 9 0 00-18 0z"/></svg>Changelog</a>
      </nav>
      <div class="side-foot">
        <div class="side-card">
          <b>Pivote A+C activo</b>
          <div style="font-size:11.5px;line-height:1.5;color:var(--muted)">Plástico sólo en biorreactor contenido. Hidrocarburos in-situ vía cápsulas alginato.</div>
          <div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--line)">
            <div class="side-stat"><span>TRL sistema</span><b>3–4</b></div>
            <div class="side-stat"><span>Microorganismos</span><b>28</b></div>
            <div class="side-stat"><span>Referencias</span><b>4,797</b></div>
          </div>
        </div>
      </div>
    </aside>`;

  const topbar = `
    <div class="topbar">
      <div class="crumbs">
        <b>Impulso BioCycle</b>
        <span class="sep">/</span>
        <span>Producto</span>
        <span class="sep">/</span>
        <b style="color:var(--forest-deep)">${crumb}</b>
      </div>
      <div class="tb-spacer"></div>
      <div class="tb-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
        Buscar contaminante, microorganismo, paper…
        <span class="kbd">⌘K</span>
      </div>
      <button class="tb-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13 21a2 2 0 01-4 0"/></svg>Novedades</button>
      <button class="tb-btn primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>Reservar piloto</button>
    </div>`;

  // Inject into the .app container
  const app = document.querySelector('.app');
  if (app) {
    app.insertAdjacentHTML('afterbegin', sidebar);
    const main = app.querySelector('main');
    if (main) main.insertAdjacentHTML('afterbegin', topbar);
  }
})();
