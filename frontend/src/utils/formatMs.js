import addZero from './addZero';
import parseMs from './parseMs';

export default (ms, options) => {
  if (typeof ms !== 'number') return;
  const unsignedMs = ms < 0 ? -ms : ms;

  const t = parseMs(unsignedMs);
  const seconds = addZero(t.seconds);
  const minutes = addZero(t.minutes);
  const centiseconds = addZero(t.centiseconds);

  if (options.minutes && options.milliseconds) {
    return `${minutes}:${seconds}.${centiseconds}`;
  }

  if (options.milliseconds) {
    return `${seconds}.${centiseconds}`;
  }

  return seconds;
};
