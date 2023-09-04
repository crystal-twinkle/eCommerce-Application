export default function disableScroll(): void {
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.overflowY = 'scroll';
}
