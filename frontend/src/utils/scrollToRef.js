export default (ref) =>
  window.scrollTo({ top: ref.current.offsetTop, behavior: 'smooth' });
