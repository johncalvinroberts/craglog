import formatDistance from 'date-fns/formatDistance';

const initialCountDown = 10000; // initial countdown before the workout begins

export function calculateSequenceTimeInMilliseconds(sequence = []) {
  return sequence.reduce((memo, current) => {
    const { rest, duration, repetitions } = current;
    const restTime = rest ? rest * 1000 : 0;
    let durationTime = 0;
    if (current.duration && !current.repetitions) {
      durationTime = duration * 1000;
    }

    if (current.repetitions && !current.repetitions) {
      durationTime = repetitions * 4000;
    }

    return memo + durationTime + restTime;
  }, initialCountDown);
}

export function calculateSequenceTimeInWords(sequence = []) {
  const totalMs = calculateSequenceTimeInMilliseconds(sequence);
  const timeInWords = formatDistance(0, totalMs);
  return timeInWords;
}
