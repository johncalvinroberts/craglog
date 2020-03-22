import delay from './delay';

const getSpeechSynthesisVoices = async () => {
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) return voices;
  await delay(200);
  return getSpeechSynthesisVoices();
};

export default getSpeechSynthesisVoices;
