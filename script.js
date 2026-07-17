const revealItems = [...document.querySelectorAll('.reveal')];

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

const story = document.querySelector('.story');
const trunk = document.querySelector('.trunk');
const branches = [...document.querySelectorAll('.branch')];
const leaves = [...document.querySelectorAll('.leaves circle')];
const flowers = [...document.querySelectorAll('.flowers circle')];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function updateTree() {
  if (!story || !trunk) return;

  const rect = story.getBoundingClientRect();
  const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.55), 0, 1);

  trunk.style.strokeDashoffset = String(820 * (1 - clamp(progress / 0.3, 0, 1)));

  branches.forEach((branch, index) => {
    const value = clamp((progress - (0.18 + index * 0.035)) / 0.35, 0, 1);
    branch.style.strokeDashoffset = String(520 * (1 - value));
  });

  leaves.forEach((leaf, index) => {
    const value = clamp((progress - (0.48 + index * 0.018)) / 0.18, 0, 1);
    leaf.style.opacity = value;
    leaf.style.transform = `scale(${0.2 + value * 0.8})`;
  });

  flowers.forEach((flower, index) => {
    const value = clamp((progress - (0.7 + index * 0.014)) / 0.18, 0, 1);
    flower.style.opacity = value;
    flower.style.transform = `scale(${0.2 + value * 0.8})`;
  });
}

window.addEventListener('scroll', updateTree, { passive: true });
window.addEventListener('resize', updateTree);
updateTree();

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function bloom() {
  for (let index = 0; index < 30; index += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${4 + Math.random() * 4}s`;
    petal.style.animationDelay = `${Math.random() * 0.5}s`;
    petal.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
    document.body.appendChild(petal);
    window.setTimeout(() => petal.remove(), 9000);
  }
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const temporary = document.createElement('textarea');
    temporary.value = text;
    document.body.appendChild(temporary);
    temporary.select();
    document.execCommand('copy');
    temporary.remove();
  }
  showToast(message);
}

async function copyMessage() {
  const text = document.getElementById('messageText').value;
  await copyText(text, '紹介メッセージをコピーしました');
  bloom();
}

async function copyCoupon() {
  const code = document.getElementById('couponCode').textContent.trim();
  await copyText(code, 'クーポンコードをコピーしました');
}

async function copyCouponAndOpen() {
  await copyCoupon();
  window.setTimeout(() => {
    window.open('https://estlela.jp/U282500/', '_blank', 'noopener');
  }, 300);
}
