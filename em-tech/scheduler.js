const SCHED_WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const SCHED_MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const SCHED_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

function initScheduler(rootId) {
  const root = document.getElementById(rootId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;

  root.innerHTML =
    '<div class="scheduler-cal-header">' +
      '<button class="scheduler-nav-btn" id="' + rootId + '-prev" aria-label="Mês anterior">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6 L9 12 L15 18"/></svg>' +
      '</button>' +
      '<span id="' + rootId + '-label"></span>' +
      '<button class="scheduler-nav-btn" id="' + rootId + '-next" aria-label="Próximo mês">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6 L15 12 L9 18"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="scheduler-weekdays">' + SCHED_WEEKDAYS.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>' +
    '<div class="scheduler-days" id="' + rootId + '-days"></div>' +
    '<div class="scheduler-slots" id="' + rootId + '-slots"><p class="scheduler-hint">Selecione uma data disponível.</p></div>';

  const labelEl = document.getElementById(rootId + '-label');
  const daysEl = document.getElementById(rootId + '-days');
  const slotsEl = document.getElementById(rootId + '-slots');
  const prevBtn = document.getElementById(rootId + '-prev');
  const nextBtn = document.getElementById(rootId + '-next');

  function isBookable(date) {
    if (date < today) return false;
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  function renderCalendar() {
    labelEl.textContent = SCHED_MONTHS[viewMonth] + ' de ' + viewYear;
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    let html = '';
    for (let i = 0; i < firstWeekday; i++) {
      html += '<button class="empty" tabindex="-1" aria-hidden="true"></button>';
    }
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const bookable = isBookable(date);
      const isToday = date.getTime() === today.getTime();
      const classes = ['day'];
      if (bookable) classes.push('bookable');
      if (isToday) classes.push('today');
      html += '<button type="button" class="' + classes.join(' ') + '" data-date="' + date.toISOString() + '" ' + (bookable ? '' : 'disabled') + '>' + d + '</button>';
    }
    daysEl.innerHTML = html;
    daysEl.querySelectorAll('button.bookable').forEach(function (btn) {
      btn.addEventListener('click', function () {
        daysEl.querySelectorAll('button.selected').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selectedDate = new Date(btn.getAttribute('data-date'));
        renderSlots();
      });
    });
  }

  function formatDate(date) {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  }

  function renderSlots() {
    const dayOfMonth = selectedDate.getDate();
    let html = '<p class="slot-label">Horários em ' + formatDate(selectedDate) + '</p><div class="slot-grid">';
    SCHED_TIMES.forEach(function (time, idx) {
      const unavailable = (dayOfMonth + idx) % 4 === 0;
      html += '<button type="button" class="slot-btn" data-time="' + time + '" ' + (unavailable ? 'disabled' : '') + '>' + time + (unavailable ? ' · ocupado' : '') + '</button>';
    });
    html += '</div>';
    slotsEl.innerHTML = html;
    slotsEl.querySelectorAll('.slot-btn:not(:disabled)').forEach(function (btn) {
      btn.addEventListener('click', function () { renderConfirmForm(btn.getAttribute('data-time')); });
    });
  }

  function renderConfirmForm(time) {
    const dateLabel = formatDate(selectedDate);
    slotsEl.innerHTML =
      '<p class="slot-label">Confirmar horário</p>' +
      '<p class="confirm-summary"><strong>' + dateLabel + ' às ' + time + '</strong></p>' +
      '<form class="confirm-form" id="' + rootId + '-form">' +
        '<input type="text" name="nome" placeholder="Seu nome" required aria-label="Seu nome">' +
        '<input type="email" name="email" placeholder="Seu e-mail" required aria-label="Seu e-mail">' +
        '<button type="submit" class="btn">Confirmar agendamento</button>' +
        '<button type="button" class="link-reset" id="' + rootId + '-back">Escolher outro horário</button>' +
      '</form>';
    document.getElementById(rootId + '-back').addEventListener('click', renderSlots);
    document.getElementById(rootId + '-form').addEventListener('submit', function (e) {
      e.preventDefault();
      renderSuccess(dateLabel, time);
    });
  }

  function renderSuccess(dateLabel, time) {
    slotsEl.innerHTML =
      '<div class="success-state">' +
        '<div class="success-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12 L10 18 L20 6"/></svg></div>' +
        '<h3>Agendamento confirmado</h3>' +
        '<p>' + dateLabel + ' às ' + time + '. Você vai receber o convite por e-mail.</p>' +
        '<button type="button" class="link-reset" id="' + rootId + '-reset">Marcar outro horário</button>' +
      '</div>';
    document.getElementById(rootId + '-reset').addEventListener('click', function () {
      daysEl.querySelectorAll('button.selected').forEach(function (b) { b.classList.remove('selected'); });
      slotsEl.innerHTML = '<p class="scheduler-hint">Selecione uma data disponível.</p>';
    });
  }

  prevBtn.addEventListener('click', function () {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendar();
  });
  nextBtn.addEventListener('click', function () {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendar();
  });

  renderCalendar();
}
