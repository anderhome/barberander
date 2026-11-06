// Panel de Anderson · botón "Descargar app" (instalar el panel en el celular o computador)
(function () {
  const { $, $$ } = window.U;
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const installed = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  let prompt = null;

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

  // El botón se ve siempre (menos dentro de la app ya instalada)
  function refresh() {
    $$("[data-install]").forEach((b) => (b.hidden = installed()));
    $("#installDone").hidden = !installed();
  }

  // Chrome, Edge y Samsung: el navegador nos deja abrir su ventana de instalar
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    prompt = e;
  });

  window.addEventListener("appinstalled", () => {
    prompt = null;
    window.Admin?.toast("App instalada ✓ Búscala en tu pantalla de inicio");
  });

  // Si el navegador no deja instalar con un botón, explicamos cómo hacerlo desde su menú
  function steps() {
    if (isIOS) {
      return 'En iPhone se instala desde Safari:\n\n1. Abre esta página en Safari.\n2. Toca el botón Compartir (el cuadrado con la flecha hacia arriba).\n3. Elige "Agregar a pantalla de inicio" y luego "Agregar".';
    }
    if (isAndroid) {
      return 'Para instalar:\n\n1. Toca el menú del navegador (los 3 puntos ⋮ arriba a la derecha).\n2. Elige "Instalar app" o "Agregar a pantalla de inicio".\n\nSi no aparece, abre esta página en Google Chrome.';
    }
    return 'Para instalar en el computador:\n\n• Chrome o Edge: toca el ícono de instalar al final de la barra de direcciones, o el menú ⋮ → "Instalar Xander Panel".\n• Safari (Mac): menú Archivo → "Agregar al Dock".\n\nFirefox no permite instalar apps: usa Chrome o Edge.';
  }

  document.addEventListener("click", async (e) => {
    if (!e.target.closest("[data-install]")) return;
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice;
      prompt = null;
    } else {
      alert(steps());
    }
  });

  matchMedia("(display-mode: standalone)").addEventListener("change", refresh);
  refresh();
})();
