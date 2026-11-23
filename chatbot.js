// ===== "Sunny" — Ember & Oat chatbot (works on every page that loads this file) =====
(function () {
  // ---- Knowledge base: keywords -> answer ----
  const KB = [
    { keys: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good afternoon'],
      reply: "Hey there! ☀️ I'm Sunny, the Ember & Oat assistant. Ask me about our menu, prices, location, hours, catering or the Sun Club." },
    { keys: ['menu', 'drinks', 'serve', 'offer', 'coffee', 'have'],
      reply: "We serve espresso drinks, cold brew, matcha and chai. Add oat, almond or whole milk plus vanilla, caramel or lavender. Try the Drink Builder on our home page to design your own! ☕" },
    { keys: ['price', 'cost', 'how much', 'expensive', 'cheap'],
      reply: "Drinks start at $3.25 for a small espresso. Most medium lattes are $4–$5.50. Bring your own mug and get 50¢ off!" },
    { keys: ['where', 'location', 'find', 'address', 'today'],
      reply: "We move around! 🚐 Weekdays we're usually on campus near the main library (7am–1pm), and weekends at the Saturday farmers' market. The weekly schedule is posted on our socials." },
    { keys: ['hour', 'open', 'close', 'time', 'when'],
      reply: "Typical hours are 7:00am–1:00pm on weekdays and 8:00am–2:00pm on weekends — or until the batteries say goodnight. 🔋" },
    { keys: ['solar', 'sun', 'power', 'energy', 'battery', 'electric'],
      reply: "Our roof has 2.4 kW of solar panels feeding a lithium battery bank. That's enough to run a commercial espresso machine all day with zero generator fuel." },
    { keys: ['oat', 'milk', 'vegan', 'dairy', 'lactose', 'almond'],
      reply: "Oat milk is our house default and it's made fresh. Almond (+50¢) and whole milk are available too. Every drink can be made vegan. 🌾" },
    { keys: ['cater', 'event', 'wedding', 'party', 'book', 'hire', 'private'],
      reply: "We love events! We cater weddings, campus events and corporate offsites. Since we're silent and generator-free, we fit almost anywhere. Packages start at $350 for 75 drinks." },
    { keys: ['subscri', 'sun club', 'membership', 'monthly', 'deal', 'discount'],
      reply: "The Sun Club is $39/month for one drink every day we're open. It pays for itself in about 10 visits! 🌞" },
    { keys: ['waste', 'cup', 'compost', 'recycle', 'sustainab', 'green', 'eco'],
      reply: "All cups and lids are compostable, and we donate our used coffee grounds to community gardens every week. Bring your own mug for 50¢ off. ♻️" },
    { keys: ['food', 'eat', 'pastry', 'snack', 'croissant', 'muffin'],
      reply: "We carry a small rotating selection of pastries from a local bakery — usually croissants, banana bread and a vegan muffin." },
    { keys: ['wifi', 'seat', 'sit', 'table'],
      reply: "We're a truck, so there's no indoor seating — but we usually park near benches or green space. Grab a cup and enjoy the sun!" },
    { keys: ['thank', 'thanks', 'awesome', 'great', 'cool'],
      reply: "You're welcome! Hope to see you at the truck soon. ☕☀️" },
    { keys: ['bye', 'goodbye', 'see you', 'later'],
      reply: "Bye for now! Stay caffeinated. 👋" },
    { keys: ['who are you', 'your name', 'are you a bot', 'human'],
      reply: "I'm Sunny, a friendly chatbot for Ember & Oat. I can answer questions about the business 24/7 — even after sunset. 🌙" }
  ];
  const FALLBACK = [
    "Hmm, I'm not sure about that one. Try asking about our menu, prices, hours, location, catering or the Sun Club!",
    "Good question! I only know about Ember & Oat for now. Ask me about drinks, solar power or booking an event. ☕"
  ];
  const QUICK = ['Menu', 'Prices', 'Where are you?', 'Catering', 'Sun Club'];

  function answer(text) {
    const t = text.toLowerCase();
    let best = null, bestScore = 0;
    KB.forEach(item => {
      const score = item.keys.reduce((s, k) => s + (t.includes(k) ? k.length : 0), 0);
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best ? best.reply : FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
  }

  // ---- Build the widget ----
  const toggle = document.createElement('button');
  toggle.className = 'chat-toggle';
  toggle.setAttribute('aria-label', 'Open chat');
  toggle.textContent = '💬';

  const win = document.createElement('div');
  win.className = 'chat-window';
  win.innerHTML = `
    <div class="chat-header">
      <div class="avatar">☀️</div>
      <div><strong>Sunny</strong><small>Ember &amp; Oat Assistant · Online</small></div>
      <button aria-label="Close chat">×</button>
    </div>
    <div class="chat-messages"></div>
    <div class="quick-replies"></div>
    <form class="chat-input">
      <input type="text" placeholder="Ask me anything..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>`;

  document.body.append(toggle, win);

  const messages = win.querySelector('.chat-messages');
  const form = win.querySelector('form');
  const input = form.querySelector('input');
  const quick = win.querySelector('.quick-replies');

  QUICK.forEach(q => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = q;
    b.onclick = () => send(q);
    quick.appendChild(b);
  });

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function send(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => { typing.remove(); addMsg(answer(text), 'bot'); }, 600 + Math.random() * 600);
  }

  let greeted = false;
  function openChat() {
    win.classList.add('open');
    toggle.textContent = '×';
    if (!greeted) {
      greeted = true;
      addMsg("Hi! I'm Sunny ☀️ How can I help you today?", 'bot');
    }
    input.focus();
  }
  function closeChat() { win.classList.remove('open'); toggle.textContent = '💬'; }

  toggle.onclick = () => win.classList.contains('open') ? closeChat() : openChat();
  win.querySelector('.chat-header button').onclick = closeChat;
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); input.value = ''; });
})();
