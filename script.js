/* GLOBAL DOM */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const themeToggle = document.getElementById('themeToggle');

/* MOBILE NAV */
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

/* THEME TOGGLE (LIGHT / DARK) */
if (themeToggle) {

  const applyTheme = (mode) => {
    document.body.classList.toggle('light-mode', mode === 'light');
    themeToggle.textContent = mode === 'light' ? 'Dark Mode' : 'Light Mode';
  };

  const savedTheme = localStorage.getItem('gst_theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('gst_theme', newTheme);
  });
}

/* SCROLL ANIMATION (FADE-IN) */
const faders = document.querySelectorAll('.fade-in');

if (faders.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(el => observer.observe(el));
}

/* PRODUCT FILTER (GENRE + PLATFORM) */
function filterGames() {
  const genre = document.getElementById("genreFilter")?.value || "All";
  const platform = document.getElementById("platformFilter")?.value || "All";

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const cardGenre = card.dataset.genre;
    const cardPlatform = card.dataset.platform.toUpperCase();

    const matchGenre = genre === "All" || cardGenre === genre;
    const matchPlatform =
      platform === "All" || cardPlatform.includes(platform.toUpperCase());

    card.style.display = (matchGenre && matchPlatform) ? "block" : "none";
  });
}

/* PURCHASE SUMMARY CALCULATION */
function updateTotalFromSelection() {
  const select = document.getElementById("gameSelect");
  if (!select) return;

  const [, priceValue] = select.value.split("|");
  const price = parseFloat(priceValue);

  const tax = price * 0.10;
  const total = price + tax;

  document.getElementById("price").textContent =
    price === 0 ? "FREE" : price.toFixed(2);

  document.getElementById("tax").textContent =
    price === 0 ? "0.00" : tax.toFixed(2);

  document.getElementById("total").textContent =
    price === 0 ? "0.00" : total.toFixed(2);
}

/* INIT price calculation */
const gameSelectEl = document.getElementById('gameSelect');
if (gameSelectEl) {
  gameSelectEl.addEventListener('change', updateTotalFromSelection);
  updateTotalFromSelection();
}

/* PURCHASE FORM VALIDATION */
const form = document.getElementById('purchaseForm');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const cardnumber = document.getElementById('cardnumber').value.trim();
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const agree = document.getElementById('agree').checked;
    const errorEl = document.getElementById('errorMsg');

    let error = "";

    if (fullname.length < 3) {
      error = "Full name must be at least 3 characters.";
    }
    else if (cardnumber.length !== 16 || isNaN(cardnumber)) {
      error = "Card number must be exactly 16 digits.";
    }
    else if (!expiry) {
      error = "Please select an expiry date.";
    }
    else if (new Date(expiry) < new Date()) {
      error = "Card has expired.";
    }
    else if (cvv.length !== 3 || isNaN(cvv)) {
      error = "CVV must be exactly 3 digits.";
    }
    else if (!payment) {
      error = "Please select a payment method.";
    }
    else if (!agree) {
      error = "You must agree to the terms & conditions.";
    }

    if (error) {
      errorEl.textContent = error;
      return;
    }

    errorEl.textContent = "";

    document.getElementById("successOverlay").classList.add("active");

    form.reset();
    updateTotalFromSelection();
  });
}

/* BUY BUTTON → REDIRECT TO PURCHASE */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const name = card.dataset.name;
      const price = card.dataset.price;

      localStorage.setItem("selectedGame", `${name}|${price}`);
      window.location.href = "purchase.html";
    });
  });

  /* AUTO SELECT GAME ON PURCHASE PAGE */
  const select = document.getElementById("gameSelect");
  const savedGame = localStorage.getItem("selectedGame");

  if (select && savedGame) {
    [...select.options].forEach((opt, i) => {
      if (opt.value === savedGame) {
        select.selectedIndex = i;
      }
    });

    localStorage.removeItem("selectedGame");
  }
});

/* SUCCESS POPUP CONTROL */
function closeSuccess() {
  document.getElementById("successOverlay").classList.remove("active");
}