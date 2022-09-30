import { createSignal } from 'solid-js';

let t: NodeJS.Timeout;

window.addEventListener('mousemove', (event) => {
  if (event.target === document.documentElement) {
    window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      window.electronAPI.setIgnoreMouseEvents(false, { forward: false });
    }, 150);
  } else {
    window.electronAPI.setIgnoreMouseEvents(false, { forward: false });
  }
});

window.onload = function (): void {
  window.electronAPI.toggleWindow((_event, value) => {
    const body = document.querySelector('body') as HTMLElement;
    if (!value) {
      setTimeout(() => {
        body.classList.remove('hidden');
      }, 1);
    } else {
      body.classList.add('hidden');
    }
  });
  window.electronAPI.getMousePosition((_event, value) => {
    console.log(value);
    setShowPosition(value);
  });
};

export const [getShowPosition, setShowPosition] = createSignal({ x: 0, y: 0 });

export default {};