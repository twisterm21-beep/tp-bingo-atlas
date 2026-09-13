(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('.speaker-tabs [role="tab"]')];
  const panels = [...document.querySelectorAll('.speaker-panel')];
  const count = document.querySelector('.speaker-count');
  const stages = [...document.querySelectorAll('.speaker-video-stage')];
  if (!tabs.length || tabs.length !== panels.length) return;
  const canEmbed = /^https?:$/.test(window.location.protocol);
  let active = 0;
  function stopVideo() {
    stages.forEach(stage => {
      stage.querySelector('iframe')?.remove();
      stage.querySelector('.speaker-play').hidden = false;
    });
  }
  function select(index, focus = false) {
    const next = (index + panels.length) % panels.length;
    if (next !== active) stopVideo();
    active = next;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
      panels[i].hidden = i !== active;
    });
    count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(panels.length).padStart(2, '0');
    if (focus) tabs[active].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = active + 1;
      if (event.key === 'ArrowLeft') target = active - 1;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      select(target, true);
    });
  });
  document.querySelector('.speaker-prev').addEventListener('click', () => select(active - 1));
  document.querySelector('.speaker-next').addEventListener('click', () => select(active + 1));
  stages.forEach(stage => {
    const play = stage.querySelector('.speaker-play');
    if (!canEmbed) {
      play.querySelector('.play-label').textContent = 'Смотреть на YouTube ↗';
      play.setAttribute('aria-label', stage.dataset.videoTitle + ' — открыть на YouTube в новой вкладке');
    }
    play.addEventListener('click', event => {
      // Local files have no HTTP Referer; use the real link instead of a failing embed.
      // Preserve standard open-in-new-tab behavior for modified clicks everywhere.
      if (!canEmbed || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
      event.preventDefault();
      if (stage.querySelector('iframe')) return;
      const frame = document.createElement('iframe');
      const videoId = encodeURIComponent(stage.dataset.videoId);
      const start = Number(stage.dataset.start) || 0;
      frame.title = stage.dataset.videoTitle;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + start + '&autoplay=1&rel=0&origin=' + encodeURIComponent(window.location.origin);
      play.hidden = true;
      stage.append(frame);
      frame.focus();
    });
  });
  select(0);
  document.querySelectorAll('.speaker-toolbar, .speaker-arrow, .speaker-play').forEach(el => { el.hidden = false; });
})();
