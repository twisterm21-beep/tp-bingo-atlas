(() => {
  'use strict';
  const key = 'tp-bingo-theme';
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let dark = false;
  try { dark = localStorage.getItem(key) === 'dark'; } catch {}

  function apply() {
    root.dataset.theme = dark ? 'dark' : 'light';
    themeColor?.setAttribute('content', dark ? '#121313' : '#14244b');
    const toggle = document.getElementById('theme-toggle');
    toggle?.setAttribute('aria-pressed', String(dark));
  }

  // Restore the saved theme before the stylesheet paints the page.
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.hidden = false;
    apply();
    toggle.addEventListener('click', () => {
      dark = !dark;
      apply();
      try { localStorage.setItem(key, dark ? 'dark' : 'light'); } catch {}
    });
  }, { once: true });
})();
