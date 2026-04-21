// Brooklyn Barbearia — main.js

// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════

const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.borderBottomColor = '#2a2a2a';
  } else {
    navbar.style.borderBottomColor = 'transparent';
  }
}, { passive: true });

const sections = document.querySelectorAll('section[id], div[id="mapa"]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          // Se for o mapa, ativa o link de Localização
          if (id === 'mapa' && a.getAttribute('href') === '#mapa') {
            a.style.color = 'var(--text)';
          } else if (id !== 'mapa' && a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--text)';
          } else {
            a.style.color = '';
          }
        });
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach(s => observer.observe(s));

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════════
// BOOKING WIZARD
// ═══════════════════════════════════════════════

const PHONE = '5547996811600';

// Horários de funcionamento por dia da semana (0=Dom, 1=Seg, ..., 6=Sáb)
const SCHEDULE = {
  0: null,                    // Domingo — Fechado
  1: { start: 14, end: 19 }, // Segunda
  2: { start: 9, end: 19 },  // Terça
  3: { start: 9, end: 19 },  // Quarta
  4: { start: 9, end: 19 },  // Quinta
  5: { start: 9, end: 19 },  // Sexta
  6: { start: 7, end: 14 },  // Sábado
};

// State
const booking = {
  service: null,
  price: null,
  date: null,
  time: null,
};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// ─── Step navigation ───

function goToStep(step) {
  // Update panels
  document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');

  // Update step indicators
  const stepEls = document.querySelectorAll('.wizard-step');
  const lineEls = document.querySelectorAll('.wizard-step-line');

  stepEls.forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === step) el.classList.add('active');
    else if (s < step) el.classList.add('done');
  });

  lineEls.forEach((line, i) => {
    if (i < step - 1) line.classList.add('done');
    else line.classList.remove('done');
  });

  // If going to step 2, render calendar
  if (step === 2) {
    renderCalendar();
  }

  // If going to step 3, populate confirmation
  if (step === 3) {
    populateConfirmation();
  }
}

// ─── Step 1: Service selection ───

document.querySelectorAll('.booking-service-card').forEach(card => {
  card.addEventListener('click', () => {
    // Deselect all
    document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
    // Select this
    card.classList.add('selected');

    booking.service = card.dataset.service;
    booking.price = card.dataset.price;

    // Auto-advance to step 2 after a short delay
    setTimeout(() => goToStep(2), 350);
  });
});

// ─── Step 2: Calendar ───

function renderCalendar() {
  const monthYearEl = document.getElementById('cal-month-year');
  const daysContainer = document.getElementById('calendar-days');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  monthYearEl.textContent = `${months[currentMonth]} ${currentYear}`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  daysContainer.innerHTML = '';

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    daysContainer.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = d;

    const date = new Date(currentYear, currentMonth, d);
    const dayOfWeek = date.getDay();
    const isPast = date < today;
    const isClosed = SCHEDULE[dayOfWeek] === null;

    if (isPast || isClosed) {
      btn.classList.add('disabled');
    } else {
      btn.addEventListener('click', () => selectDate(date, btn));
    }

    // Highlight today
    if (date.getTime() === today.getTime()) {
      btn.classList.add('today');
    }

    // Highlight selected date
    if (booking.date && date.getTime() === booking.date.getTime()) {
      btn.classList.add('selected');
    }

    daysContainer.appendChild(btn);
  }
}

document.getElementById('cal-prev').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  // Don't go before current month
  const now = new Date();
  if (currentYear < now.getFullYear() || (currentYear === now.getFullYear() && currentMonth < now.getMonth())) {
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
  }
  renderCalendar();
});

document.getElementById('cal-next').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

function selectDate(date, btnEl) {
  booking.date = date;
  booking.time = null; // Reset time when date changes

  // Update visual selection
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
  btnEl.classList.add('selected');

  // Generate time slots
  generateTimeSlots(date);

  // Disable continue button (time not yet selected)
  updateStep2Button();
}

function generateTimeSlots(date) {
  const container = document.getElementById('time-slots');
  const dayOfWeek = date.getDay();
  const schedule = SCHEDULE[dayOfWeek];

  if (!schedule) {
    container.innerHTML = '<p class="time-slots-empty">Fechado neste dia</p>';
    return;
  }

  container.innerHTML = '';

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  for (let h = schedule.start; h <= schedule.end; h++) {
    for (let m = 0; m < 60; m += 30) {
      // Don't show slots after the closing hour (only allow the :00 slot of the end hour)
      if (h === schedule.end && m > 0) break;

      // Skip times that already passed if today
      if (isToday && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()))) {
        continue;
      }

      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

      const btn = document.createElement('button');
      btn.className = 'time-slot';
      btn.textContent = timeStr;
      btn.addEventListener('click', () => selectTime(timeStr, btn));

      container.appendChild(btn);
    }
  }

  if (container.children.length === 0) {
    container.innerHTML = '<p class="time-slots-empty">Nenhum horário disponível para hoje</p>';
  }
}

function selectTime(time, btnEl) {
  booking.time = time;

  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  btnEl.classList.add('selected');

  updateStep2Button();
}

function updateStep2Button() {
  const btn = document.getElementById('btn-to-step3');
  if (booking.date && booking.time) {
    btn.disabled = false;
    btn.classList.remove('disabled');
  } else {
    btn.disabled = true;
    btn.classList.add('disabled');
  }
}

document.getElementById('btn-to-step3').addEventListener('click', () => {
  if (booking.date && booking.time) {
    goToStep(3);
  }
});

// ─── Step 3: Confirmation ───

function populateConfirmation() {
  document.getElementById('confirm-service').textContent = booking.service;
  document.getElementById('confirm-price').textContent = `R$ ${booking.price}`;
  document.getElementById('confirm-time').textContent = booking.time;

  // Format date
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const day = days[booking.date.getDay()];
  const dateStr = booking.date.toLocaleDateString('pt-BR');
  document.getElementById('confirm-date').textContent = `${day}, ${dateStr}`;

  // Generate WhatsApp link
  const text = encodeURIComponent(
    `Ola! Gostaria de solicitar um agendamento na Brooklyn Barbearia.\n\n` +
    `*Servico:* ${booking.service}\n` +
    `*Data:* ${day}, ${dateStr}\n` +
    `*Horario:* ${booking.time}\n` +
    `*Valor:* R$ ${booking.price}\n\n` +
    `Tem vaga para esse horario?`
  );

  document.getElementById('whatsapp-link').href = `https://wa.me/${PHONE}?text=${text}`;
}

// ─── Back buttons ───

document.querySelectorAll('.wizard-back').forEach(btn => {
  btn.addEventListener('click', () => {
    const to = parseInt(btn.dataset.to);
    goToStep(to);
  });
});
