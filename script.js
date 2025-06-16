const moodLevels = [
  'angry', 'upset', 'gloomy', 'meh', 'neutral',
  'okay', 'content', 'cheery', 'happy', 'ecstatic', 'hyper'
];

const profileLevels = [
  'silent', 'quiet', 'reserved', 'shy', 'plain',
  'chatty', 'outgoing', 'energetic', 'boisterous', 'wild', 'extreme'
];

function getMoodText(value) {
  return moodLevels[value];
}

function getProfileText(value) {
  return profileLevels[value];
}

function generateLine(name, moodVal, profileVal) {
  const mood = getMoodText(moodVal);
  const profile = getProfileText(profileVal);
  return `${name} feels ${mood} and ${profile}.`;
}

function update() {
  const moodA = parseInt(document.getElementById('moodA').value, 10);
  const moodB = parseInt(document.getElementById('moodB').value, 10);
  const profileA = parseInt(document.getElementById('profileA').value, 10);
  const profileB = parseInt(document.getElementById('profileB').value, 10);

  document.getElementById('lineA').textContent = generateLine('A', moodA, profileA);
  document.getElementById('lineB').textContent = generateLine('B', moodB, profileB);
}

document.querySelectorAll('input[type=range]').forEach(el => {
  el.addEventListener('input', update);
});

update();
