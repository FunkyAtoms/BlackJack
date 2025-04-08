const rulesBtn = document.getElementById('rules-btn');
const rulesSection = document.getElementById('rules');
const closeRulesBtn = document.getElementById('close-rules-btn');

rulesBtn.addEventListener('click', () => {
  rulesSection.classList.add('show');
  document.body.style.overflow = 'hidden';
});

closeRulesBtn.addEventListener('click', () => {
  rulesSection.classList.remove('show');
  document.body.style.overflow = 'auto';
});