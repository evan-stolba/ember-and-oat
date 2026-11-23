// ===== Interactive Drink Builder (X-Factor) =====
(function () {
  const state = {};
  const groups = document.querySelectorAll('.opt-group');

  const names = {
    espresso: ['Sunrise', 'Solar', 'Daybreak'],
    coldbrew: ['Midnight', 'Eclipse', 'Night Shift'],
    matcha:   ['Meadow', 'Greenhouse', 'Photosynth'],
    chai:     ['Ember', 'Spice Route', 'Campfire']
  };
  const flavorWord = { none: 'Classic', vanilla: 'Velvet', caramel: 'Golden', lavender: 'Bloom' };

  function readSelection() {
    groups.forEach(g => {
      const sel = g.querySelector('.chip.selected');
      state[g.dataset.group] = sel.dataset;
    });
  }

  function render() {
    readSelection();
    const { base, milk, flavor, size } = state;

    // Layer heights (% of cup)
    const hasMilk = milk.value !== 'none';
    const hasFlavor = flavor.value !== 'none';
    const baseH = hasMilk ? 40 : 75;
    const milkH = hasMilk ? 30 : 0;
    const flavorH = hasFlavor ? 12 : 0;
    const foamH = hasMilk ? 10 : 4;

    setLayer('layer-base', base.color, baseH);
    setLayer('layer-milk', milk.color, milkH);
    setLayer('layer-flavor', flavor.color, flavorH);
    setLayer('layer-foam', hasMilk ? '#fffaf0' : '#c9a27a', foamH);

    document.getElementById('cup').style.transform = `scale(${size.scale})`;

    // Price
    const price = [base, milk, flavor, size].reduce((sum, o) => sum + parseFloat(o.price), 0);
    const priceEl = document.getElementById('drink-price');
    priceEl.textContent = '$' + price.toFixed(2);

    // Name + description
    const pool = names[base.value];
    const idx = (milk.value.length + flavor.value.length) % pool.length;
    const name = `The ${pool[idx]} ${flavorWord[flavor.value]}`;
    const label = t => document.querySelector(`[data-group="${t}"] .chip.selected`).textContent.trim();
    let desc = `${label('size')} ${label('base').toLowerCase()}`;
    desc += hasMilk ? ` with ${label('milk').toLowerCase()} milk` : ', no milk';
    if (hasFlavor) desc += ` and ${label('flavor').toLowerCase()}`;

    document.getElementById('drink-name').textContent = name;
    document.getElementById('drink-desc').textContent = desc;

    const card = document.querySelector('.order-card');
    card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
  }

  function setLayer(id, color, h) {
    const el = document.getElementById(id);
    el.style.backgroundColor = color;
    el.style.height = h + '%';
  }

  groups.forEach(g => {
    g.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      g.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      render();
    });
  });

  document.getElementById('surprise').addEventListener('click', () => {
    groups.forEach(g => {
      const chips = g.querySelectorAll('.chip');
      chips.forEach(c => c.classList.remove('selected'));
      chips[Math.floor(Math.random() * chips.length)].classList.add('selected');
    });
    render();
  });

  // Start with an empty cup, then fill it for a nice entrance animation
  setTimeout(render, 400);
})();
