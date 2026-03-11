// 254 BEATS - Main Application JavaScript

// ── STATE ──
let currentPage = 'home';
let cart = [];

// ── CURSOR ──
const cursor = document.getElementById('cur');
const cursorRing = document.getElementById('cur-r');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorRing.style.left = (e.clientX - 16) + 'px';
  cursorRing.style.top = (e.clientY - 16) + 'px';
});

// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const bar = document.querySelector('.ld-bar');
  const pct = document.getElementById('ld-pct');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 300);
    }
    bar.style.width = progress + '%';
    pct.textContent = String(Math.floor(progress)).padStart(3, '0') + '%';
  }, 100);
});

// ── NAVIGATION ──
function go(page) {
  currentPage = page;

  // Hide all pages
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));

  // Show target page
  const targetPage = document.getElementById('pg-' + page);
  if (targetPage) {
    targetPage.classList.add('on');
  }

  // Update nav links
  document.querySelectorAll('.nav-center a').forEach(a => a.classList.remove('on'));
  const activeLink = document.getElementById('nl-' + page);
  if (activeLink) {
    activeLink.classList.add('on');
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Trigger reveal animations
  setTimeout(() => {
    observeReveals();
  }, 100);
}

// ── MOBILE MENU ──
function openMob() {
  document.getElementById('mob-menu').classList.add('open');
}

function closeMob() {
  document.getElementById('mob-menu').classList.remove('open');
}

// ── CART ──
function openCart() {
  document.getElementById('cart').classList.add('open');
  document.getElementById('cart-ov').style.display = 'block';
  updateCart();
}

function closeCart() {
  document.getElementById('cart').classList.remove('open');
  document.getElementById('cart-ov').style.display = 'none';
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-ct');
  const cartFooter = document.getElementById('cart-ft');

  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color: var(--c-gray); text-align: center; padding: 2rem 0;">Your cart is empty</p>';
    cartFooter.innerHTML = '';
  } else {
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
      total += item.price;
      return `
        <div style="padding: 1rem 0; border-bottom: var(--border);">
          <div style="font-weight: bold; margin-bottom: 0.5rem;">${item.name}</div>
          <div style="color: var(--c-gray); font-size: 0.875rem;">${item.license}</div>
          <div style="font-weight: bold; margin-top: 0.5rem;">KES ${item.price.toLocaleString()}</div>
        </div>
      `;
    }).join('');

    cartFooter.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; font-size: 1.25rem; font-weight: bold;">
        <span>Total</span>
        <span>KES ${total.toLocaleString()}</span>
      </div>
      <button class="btn btn-ink" style="width: 100%;" onclick="checkout()">Checkout with M-Pesa</button>
    `;
  }
}

function checkout() {
  showToast('M-Pesa checkout coming soon!');
}

// ── TOASTS ──
function showToast(message) {
  const toasts = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toasts.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.dataset.t);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

// ── REVEAL ON SCROLL ──
function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');

        // Trigger counter animation
        const counter = entry.target.querySelector('.cnt');
        if (counter && !counter.dataset.animated) {
          counter.dataset.animated = 'true';
          animateCounter(counter);
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.rv').forEach(el => observer.observe(el));
}

// ── SAMPLE BEATS DATA ──
const featuredBeats = [
  { id: 1, name: 'Nairobi Nights', genre: 'Afrobeats', bpm: 128, price: 1999 },
  { id: 2, name: 'Genge Flow', genre: 'Gengetone', bpm: 140, price: 1499 },
  { id: 3, name: 'Amapiano Vibes', genre: 'Amapiano', bpm: 112, price: 2499 },
  { id: 4, name: 'Drill Season', genre: 'Drill', bpm: 145, price: 1999 },
  { id: 5, name: 'Sheng Chronicles', genre: 'Gengetone', bpm: 138, price: 1799 },
  { id: 6, name: 'East African Wave', genre: 'Afrobeats', bpm: 120, price: 2199 },
];

// ── LOAD FEATURED BEATS ──
function loadFeaturedBeats() {
  const grid = document.getElementById('home-beats-grid');
  if (!grid) return;

  grid.innerHTML = featuredBeats.map(beat => `
    <div class="beat-card" style="border: var(--border); padding: 1.5rem; border-radius: var(--rad); transition: background 0.2s;"
         onmouseenter="this.style.background='var(--c-ghost-hover)'"
         onmouseleave="this.style.background='transparent'">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div>
          <div style="font-weight: bold; font-size: 1.125rem; margin-bottom: 0.5rem;">${beat.name}</div>
          <div style="font-size: 0.875rem; color: var(--c-gray);">${beat.genre} · ${beat.bpm} BPM</div>
        </div>
        <button style="padding: 0.5rem 1rem; background: var(--c-txt); color: var(--c-bg); font-size: 1.25rem; border-radius: var(--rad);">▶</button>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: var(--border);">
        <div style="font-weight: bold;">KES ${beat.price.toLocaleString()}</div>
        <button class="btn btn-ghost" style="padding: 0.5rem 1rem; font-size: 0.75rem;" onclick="addToCart(${beat.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function addToCart(beatId) {
  const beat = featuredBeats.find(b => b.id === beatId);
  if (beat) {
    cart.push({
      name: beat.name,
      license: 'Basic License',
      price: beat.price
    });
    updateCart();
    showToast(`${beat.name} added to cart!`);
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  observeReveals();
  loadFeaturedBeats();
  updateCart();

  // Set home as active
  const homeLink = document.getElementById('nl-home');
  if (homeLink) {
    homeLink.classList.add('on');
  }
});

// ── SCROLL EFFECTS ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(17,16,10,0.95)';
  } else {
    nav.style.background = 'rgba(17,16,10,0.85)';
  }
});
