/* Interações do protótipo Carona FATEC — dados e confirmações são simulados. */
(() => {
  'use strict';

  const rides = [
    { id: 'CAR-101', origin: 'Hilda', driver: 'Ana Paula', initials: 'AP', time: '07:25', seats: 2, car: 'Fiat Argo · prata' },
    { id: 'CAR-102', origin: 'Paraíso', driver: 'Lucas Ferreira', initials: 'LF', time: '07:45', seats: 1, car: 'Chevrolet Onix · branco' },
    { id: 'CAR-103', origin: 'Castelo Branco', driver: 'Mariana Costa', initials: 'MC', time: '08:10', seats: 3, car: 'Volkswagen Polo · azul' },
    { id: 'CAR-104', origin: 'Centro', driver: 'João Pedro', initials: 'JP', time: '07:50', seats: 2, car: 'Renault Kwid · vermelho' },
    { id: 'CAR-105', origin: 'Jardim América', driver: 'Bruno Almeida', initials: 'BA', time: '18:20', seats: 1, car: 'Honda Fit · cinza' },
    { id: 'CAR-106', origin: 'Hilda', driver: 'Camila Souza', initials: 'CS', time: '18:40', seats: 2, car: 'Hyundai HB20 · preto' },
    { id: 'CAR-107', origin: 'Outro', driver: 'Rafael Lima', initials: 'RL', time: '19:10', seats: 3, car: 'Toyota Etios · branco' },
    { id: 'CAR-108', origin: 'Paraíso', driver: 'Beatriz Santos', initials: 'BS', time: '08:30', seats: 2, car: 'Nissan March · prata' }
  ];
  const timeRanges = {
    '07:00 – 08:00': [420, 480],
    '08:00 – 09:00': [480, 540],
    '18:00 – 19:00': [1080, 1140],
    '19:00 – 20:00': [1140, 1200]
  };
  const screens = ['home', 'rides', 'confirmation'];
  const storageKey = 'carona-fatec-demo-request';
  let search = null;
  let selectedRide = null;

  const byId = (id) => document.getElementById(id);
  const form = byId('search-form');
  const dateInput = byId('date');
  const localToday = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;
  dateInput.value = localToday;

  function setScreen(name) {
    screens.forEach((screen) => byId(`screen-${screen}`).classList.toggle('hidden', screen !== name));
    document.querySelectorAll('.step').forEach((step, index) => {
      const current = screens.indexOf(name);
      step.classList.toggle('active', index === current);
      step.classList.toggle('done', index < current);
      if (index === current) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatDate(value) {
    if (!value) return 'Data não informada';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
  }

  function getAvailableRides() {
    const range = timeRanges[search.time];
    return rides.filter((ride) => {
      if (ride.origin !== search.origin) return false;
      if (!range) return true;
      const [hours, minutes] = ride.time.split(':').map(Number);
      const minutesOfDay = hours * 60 + minutes;
      return minutesOfDay >= range[0] && minutesOfDay < range[1];
    });
  }

  function renderRides() {
    const matches = getAvailableRides();
    const list = byId('rides-list');
    list.replaceChildren();
    byId('result-count').textContent = `${matches.length} ${matches.length === 1 ? 'opção' : 'opções'}`;
    byId('search-summary').textContent = `${search.origin} · ${formatDate(search.date)} · ${search.time}`;
    byId('empty-state').classList.toggle('hidden', matches.length > 0);
    list.classList.toggle('hidden', matches.length === 0);

    matches.forEach((ride) => {
      const card = document.createElement('article');
      card.className = 'ride-card';
      const main = document.createElement('div');
      main.className = 'ride-main';
      const avatar = document.createElement('div');
      avatar.className = 'driver-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = ride.initials;
      const info = document.createElement('div');
      const name = document.createElement('h3');
      name.textContent = ride.driver;
      const meta = document.createElement('p');
      meta.className = 'ride-meta';
      meta.textContent = `${ride.origin} → FATEC Araçatuba · ${ride.car}`;
      const tags = document.createElement('div');
      tags.className = 'ride-tags';
      [`Saída ${ride.time}`, `${ride.seats} ${ride.seats === 1 ? 'vaga disponível' : 'vagas disponíveis'}`].forEach((label) => {
        const tag = document.createElement('span');
        tag.className = 'ride-tag';
        tag.textContent = label;
        tags.append(tag);
      });
      info.append(name, meta, tags);
      main.append(avatar, info);
      const action = document.createElement('div');
      action.className = 'ride-action';
      const fare = document.createElement('b');
      fare.textContent = 'Combinar com motorista';
      const requestButton = document.createElement('button');
      requestButton.type = 'button';
      requestButton.className = 'primary';
      requestButton.textContent = 'Pedir vaga';
      requestButton.setAttribute('aria-label', `Pedir vaga com ${ride.driver}`);
      requestButton.addEventListener('click', () => createRequest(ride));
      action.append(fare, requestButton);
      card.append(main, action);
      list.append(card);
    });
  }

  function createRequest(ride) {
    selectedRide = ride;
    const protocol = `FATEC-${Date.now().toString(36).toUpperCase()}`;
    const request = { rideId: ride.id, origin: search.origin, date: search.date, time: ride.time, protocol, approved: false };
    try { localStorage.setItem(storageKey, JSON.stringify(request)); } catch (_) { /* O fluxo continua mesmo sem armazenamento local. */ }
    renderConfirmation(request, ride);
    setScreen('confirmation');
  }

  function renderConfirmation(request, ride) {
    const details = byId('confirmation-details');
    details.replaceChildren();
    const fields = [
      ['Motorista', ride.driver],
      ['Trajeto', `${ride.origin} → FATEC Araçatuba`],
      ['Data', formatDate(request.date)],
      ['Horário de saída', request.time],
      ['Veículo', ride.car]
    ];
    fields.forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'confirm-detail';
      const key = document.createElement('span');
      key.textContent = label;
      const content = document.createElement('b');
      content.textContent = value;
      row.append(key, content);
      details.append(row);
    });
    byId('protocol').textContent = request.protocol;
    const status = byId('status-text');
    status.textContent = request.approved ? 'Aceite simulado pelo motorista' : 'Aguardando confirmação do motorista';
    status.parentElement.classList.toggle('approved', request.approved);
    byId('simulate-approval').disabled = request.approved;
    byId('simulate-approval').textContent = request.approved ? 'Aceite simulado ✓' : 'Simular aceite ✓';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    search = { origin: byId('origin').value, date: dateInput.value, time: byId('time').value };
    renderRides();
    setScreen('rides');
  });

  document.addEventListener('click', (event) => {
    const navigation = event.target.closest('[data-go]');
    if (!navigation) return;
    if (navigation.matches('a')) event.preventDefault();
    const destination = navigation.dataset.go;
    if (destination === 'rides') {
      if (!search) { setScreen('home'); return; }
      renderRides();
      setScreen('rides');
      return;
    }
    if (destination === 'confirmation') {
      if (!selectedRide) { setScreen(search ? 'rides' : 'home'); return; }
      setScreen('confirmation');
      return;
    }
    setScreen(destination);
  });

  byId('simulate-approval').addEventListener('click', () => {
    if (!selectedRide) return;
    let request;
    try { request = JSON.parse(localStorage.getItem(storageKey)); } catch (_) { request = null; }
    if (!request) return;
    request.approved = true;
    try { localStorage.setItem(storageKey, JSON.stringify(request)); } catch (_) { /* Apenas memória nesta sessão. */ }
    renderConfirmation(request, selectedRide);
  });

  function resetSearch() {
    search = null;
    selectedRide = null;
    form.reset();
    dateInput.value = localToday;
    setScreen('home');
  }
  byId('new-search').addEventListener('click', resetSearch);
})();
