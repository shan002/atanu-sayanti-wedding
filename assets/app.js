(() => {
  const cfg = window.WEDDING_CONFIG;
  const mode = document.body.dataset.invite || "wedding";
  const eventIds = cfg.inviteModes[mode] || cfg.inviteModes.wedding;
  const events = eventIds.map(id => cfg.events[id]).filter(Boolean);
  const params = new URLSearchParams(location.search);
  const guestName = (params.get("to") || "").trim();

  const icons = {
    lotus: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8c7 8 10 15 10 22-4-1-7-3-10-7-3 4-6 6-10 7 0-7 3-14 10-22Zm-17 9c9 4 15 9 17 16-5 1-9 0-13-3-1 5 0 9 3 13-8-2-14-8-17-17 4-2 7-2 10-1-1-3-1-5 0-8Zm34 0c1 3 1 5 0 8 3-1 6-1 10 1-3 9-9 15-17 17 3-4 4-8 3-13-4 3-8 4-13 3 2-7 8-12 17-16ZM18 47h28M23 53h18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    rings: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="25" cy="35" r="13" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="39" cy="35" r="13" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 14l5 7h-10l5-7Zm-6 7h12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
    diya: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 35c4 10 10 15 16 15s12-5 16-15H16Zm6 15h20M32 31c-6-5-5-12 0-18 5 6 6 13 0 18Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    colors: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="7" fill="currentColor"/><circle cx="17" cy="22" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="47" cy="21" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="48" cy="43" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="17" cy="44" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v9H7v-7h10v7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`
  };

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function eventCard(event) {
    const schedule = event.schedule.length
      ? `<div class="schedule">${event.schedule.map(([label, time]) => `<div class="schedule-row"><span>${esc(label)}</span><strong>${esc(time)}</strong></div>`).join("")}</div>`
      : `<p class="coming-soon">Celebration details will be shared soon.</p>`;

    const actions = [
      event.mapUrl ? `<a class="btn" href="${esc(event.mapUrl)}" target="_blank" rel="noopener">${icons.pin}<span>Open Map</span></a>` : "",
      event.dateTime ? `<button class="btn btn-outline" type="button" data-calendar="${esc(event.id)}">${icons.calendar}<span>Add to Calendar</span></button>` : ""
    ].join("");

    return `<article class="event-card">
      <div class="event-icon">${icons[event.icon] || icons.lotus}</div>
      <p class="kicker">Celebration</p>
      <h3>${esc(event.label)}</h3>
      <p class="event-date">${esc(event.date)}</p>
      ${event.bengaliDate ? `<p class="event-subdate">${esc(event.bengaliDate)}</p>` : ""}
      ${schedule}
      <div class="venue-block">
        <div class="venue-icon">${icons.pin}</div>
        <div><strong>${esc(event.venue)}</strong>${event.address ? `<p>${esc(event.address)}</p>` : ""}</div>
      </div>
      <div class="event-actions">${actions}</div>
    </article>`;
  }

  function familyCard(side, person) {
    const name = side === "Groom" ? cfg.couple.groom : cfg.couple.bride;
    return `<article class="family-card">
      <div class="family-symbol">${side === "Groom" ? "A" : "S"}</div>
      <p class="kicker">${side}</p>
      <h3>${esc(name)}</h3>
      <dl>
        <div><dt>Father</dt><dd>${esc(person.father)}</dd></div>
        <div><dt>Mother</dt><dd>${esc(person.mother)}</dd></div>
      </dl>
      <div class="family-address">${icons.home}<span>${esc(person.address)}</span></div>
    </article>`;
  }

  function hostCards() {
    return cfg.family.hosts.map(host => `<div class="host-person"><strong>${esc(host.name)}</strong><span>${esc(host.relation)}</span></div>`).join("");
  }

  const guestGreeting = guestName ? `<div class="guest-ribbon">Dear <strong>${esc(guestName)}</strong>, this invitation is especially for you.</div>` : "";

  document.getElementById("app").innerHTML = `
    <div class="opening" id="opening">
      <div class="opening-ornament">${icons.lotus}</div>
      <p class="sacred-line">Shri Shri Prajapataye Namah</p>
      ${guestName ? `<p class="opening-guest">Dear ${esc(guestName)}</p>` : `<p class="opening-small">You are cordially invited</p>`}
      <button class="envelope" id="openInvitation" aria-label="Open wedding invitation">
        <span class="seal"><span>${cfg.couple.initials}</span></span>
      </button>
      <h1 class="opening-names">${cfg.couple.shortGroom} <em>&</em> ${cfg.couple.shortBride}</h1>
      <p class="tap">Tap the seal to open</p>
    </div>

    <header class="hero" id="home">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-pattern" aria-hidden="true"></div>
      <div class="petal-layer" id="petalLayer" aria-hidden="true"></div>
      <nav class="nav">
        <a class="nav-mark" href="#home">${cfg.couple.initials}</a>
        <div class="nav-links"><a href="#story">Welcome</a><a href="#families">Families</a><a href="#events">Events</a><a href="#gallery">Gallery</a><a href="#rsvp">RSVP</a></div>
      </nav>
      <div class="hero-content">
        <div class="hero-lotus">${icons.lotus}</div>
        <p class="hero-kicker">With the blessings of our families</p>
        <h1>${cfg.couple.shortGroom}<span>&</span>${cfg.couple.shortBride}</h1>
        <div class="hero-rule"><i></i><b>13 • 12 • 2026</b><i></i></div>
        ${guestGreeting}
      </div>
      <a href="#story" class="scroll-cue">Enter the celebration <span>↓</span></a>
    </header>

    <main>
      <section class="section intro-section" id="story">
        <div class="intro-photo">
          <div class="photo-frame"><img src="/images/couple.jpg" alt="${esc(cfg.couple.shortGroom)} and ${esc(cfg.couple.shortBride)}" onerror="this.style.display='none'"></div>
          <div class="photo-flower flower-one">✦</div><div class="photo-flower flower-two">❀</div>
        </div>
        <div class="intro-copy">
          <p class="kicker">A sacred beginning</p>
          <h2>Two hearts, two families, one beautiful journey.</h2>
          <p>With the blessings of Lord Prajapati and the warm wishes of our family and friends, we joyfully invite you to celebrate the union of <strong>${esc(cfg.couple.groom)}</strong> and <strong>${esc(cfg.couple.bride)}</strong>.</p>
          <div class="mini-ornament"><span></span>${icons.lotus}<span></span></div>
          <p class="signature">${cfg.couple.shortGroom} & ${cfg.couple.shortBride}</p>
        </div>
      </section>

      <section class="blessing-band">
        <div class="blessing-inner"><span>✦</span><p>May this new chapter be filled with love, laughter, blessings and togetherness.</p><span>✦</span></div>
      </section>

      <section class="section center" id="families">
        <p class="kicker">Together with our families</p>
        <h2 class="section-title">Our Families</h2>
        <p class="section-lead">Two families coming together to celebrate one cherished bond.</p>
        <div class="family-grid">
          ${familyCard("Groom", cfg.family.groom)}
          ${familyCard("Bride", cfg.family.bride)}
        </div>

        <div class="host-card">
          <div class="host-icon">${icons.lotus}</div>
          <p class="kicker">With love and warm invitation</p>
          <h3>Your presence will make our celebration complete</h3>
          <div class="host-list">${hostCards()}</div>
        </div>
      </section>

      <section class="countdown-section">
        <div class="countdown-ornament">${icons.lotus}</div>
        <p class="kicker">Counting the moments</p>
        <h2>Until the wedding day</h2>
        <div class="countdown" id="countdown">
          <div class="time-box"><strong id="days">00</strong><span>Days</span></div>
          <div class="time-box"><strong id="hours">00</strong><span>Hours</span></div>
          <div class="time-box"><strong id="minutes">00</strong><span>Minutes</span></div>
          <div class="time-box"><strong id="seconds">00</strong><span>Seconds</span></div>
        </div>
      </section>

      <section class="section center" id="events">
        <p class="kicker">The celebrations</p>
        <h2 class="section-title">${events.length === 1 ? "Wedding Day" : "Save the Dates"}</h2>
        <p class="section-lead">${events.length === 1 ? "We would be honored to have you with us for our wedding ceremony." : "We would be honored to celebrate these special moments with you."}</p>
        <div class="event-grid">${events.map(eventCard).join("")}</div>
      </section>

      <section class="gallery-section" id="gallery">
        <div class="section center gallery-heading">
          <p class="kicker">Our moments</p>
          <h2 class="section-title">A Little Bit of Us</h2>
          <p class="section-lead">A few memories before we begin our forever.</p>
        </div>
        <div class="gallery">
          ${[1,2,3,4].map(i => `<button type="button" data-full="/images/pic-${i}.jpg"><img src="/images/pic-${i}.jpg" alt="${esc(cfg.couple.shortGroom)} and ${esc(cfg.couple.shortBride)} photo ${i}" onerror="this.style.display='none'"></button>`).join("")}
        </div>
      </section>

      <section class="section rsvp-section" id="rsvp">
        <div class="rsvp-card">
          <div class="rsvp-ornament">${icons.lotus}</div>
          <p class="kicker">Kindly respond</p>
          <h2>Will you celebrate with us?</h2>
          <p>${events.length > 1 ? esc(cfg.rsvp.intro) : "Please let us know if you will be able to attend our wedding."}</p>

          <form id="rsvpForm">
            <div class="form-grid">
              <label><span>Your name</span><input id="rsvpName" name="name" required autocomplete="name" placeholder="Enter your name" value="${esc(guestName)}"></label>
              <label><span>Number of guests</span><input id="rsvpGuests" name="guests" type="number" min="1" max="20" value="1" required></label>
            </div>

            <fieldset>
              <legend>Can you join us?</legend>
              <div class="attendance-choice">
                <label><input type="radio" name="replyStatus" value="attending" checked><span>Joyfully attending</span></label>
                <label><input type="radio" name="replyStatus" value="declining"><span>Regretfully unable to attend</span></label>
              </div>
            </fieldset>

            ${events.length > 1 ? `<fieldset id="eventAttendance">
              <legend>Which events will you attend?</legend>
              <div class="event-checks">
                ${events.map((event, index) => `<label class="event-check"><input type="checkbox" name="attendance" value="${esc(event.label)}" ${index === 0 ? "checked" : ""}><span>${icons[event.icon] || icons.lotus}<b>${esc(event.label)}</b></span></label>`).join("")}
              </div>
            </fieldset>` : ""}

            <label><span>Message for the couple <small>(optional)</small></span><textarea id="rsvpMessage" rows="3" placeholder="Leave a blessing or note..."></textarea></label>

            <div class="rsvp-buttons">
              <button class="rsvp-submit" type="submit"><span>Send RSVP on WhatsApp</span><span aria-hidden="true">→</span></button>
              <button class="rsvp-copy" id="copyRsvp" type="button">Copy RSVP message</button>
            </div>
            <p class="rsvp-note" id="rsvpNoteText">${cfg.rsvp.whatsappNumber ? "Your RSVP will open directly in WhatsApp." : "No RSVP number is set yet, so WhatsApp will open the prepared message and let you choose the recipient."}</p>
          </form>
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-lotus">${icons.lotus}</div>
      <strong>${cfg.couple.shortGroom} & ${cfg.couple.shortBride}</strong>
      <span>13 December 2026 • Chattogram</span>
      <p>Made with love for a beautiful beginning.</p>
    </footer>

    <button class="music-btn" id="musicButton" type="button" aria-label="Toggle background music" hidden>♪</button>
    <audio id="backgroundMusic" loop preload="none"></audio>
    <div class="lightbox" id="lightbox"><button class="lightbox-close" id="lightboxClose" type="button" aria-label="Close photo">×</button><img id="lightboxImage" alt=""></div>
  `;

  const opening = document.getElementById("opening");
  const openInvitation = document.getElementById("openInvitation");

  function celebrateWithPetals() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.getElementById("petalLayer");
    if (!layer) return;
    const colors = ["#e89a2e", "#f1bd45", "#d85d35", "#f2cc63"];
    for (let i = 0; i < 22; i++) {
      const petal = document.createElement("span");
      petal.className = "marigold-petal";
      petal.style.setProperty("--x", `${(i * 43) % 101}%`);
      petal.style.setProperty("--delay", `${(i % 8) * .18}s`);
      petal.style.setProperty("--drift", `${-55 + (i * 37) % 110}px`);
      petal.style.setProperty("--spin", `${180 + (i * 53) % 420}deg`);
      petal.style.setProperty("--size", `${8 + (i % 5) * 2}px`);
      petal.style.background = colors[i % colors.length];
      layer.appendChild(petal);
    }
    setTimeout(() => layer.replaceChildren(), 6500);
  }

  openInvitation.addEventListener("click", () => {
    openInvitation.classList.add("is-opening");
    setTimeout(() => {
      opening.classList.add("opened");
      document.body.classList.remove("locked");
      celebrateWithPetals();
      startMusic();
    }, 700);
  });

  function updateCountdown() {
    const target = new Date(cfg.weddingDate).getTime();
    let diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById("countdown").innerHTML = '<div class="time-box celebration-arrived"><strong>Today!</strong><span>The celebration has arrived</span></div>';
      return;
    }
    const day = 86400000, hour = 3600000, minute = 60000;
    document.getElementById("days").textContent = Math.floor(diff / day);
    diff %= day;
    document.getElementById("hours").textContent = String(Math.floor(diff / hour)).padStart(2, "0");
    diff %= hour;
    document.getElementById("minutes").textContent = String(Math.floor(diff / minute)).padStart(2, "0");
    diff %= minute;
    document.getElementById("seconds").textContent = String(Math.floor(diff / 1000)).padStart(2, "0");
  }

  function calendarText(event) {
    const compact = value => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Atanu & Sayanti//Wedding Invitation//EN",
      "BEGIN:VEVENT", `DTSTART:${compact(event.dateTime)}`, `DTEND:${compact(event.endDateTime || event.dateTime)}`,
      `SUMMARY:${event.label} — Atanu & Sayanti`,
      `LOCATION:${event.venue}${event.address ? ", " + event.address : ""}`,
      "DESCRIPTION:Celebrating the wedding of Atanu Bhattacharjee and Sayanti Bhattacharjee",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
  }

  document.querySelectorAll("[data-calendar]").forEach(button => {
    button.addEventListener("click", () => {
      const event = cfg.events[button.dataset.calendar];
      if (!event?.dateTime) return;
      const blob = new Blob([calendarText(event)], {type:"text/calendar;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event.id}-atanu-sayanti.ics`;
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  function buildRsvpMessage() {
    const name = document.getElementById("rsvpName").value.trim();
    const guests = document.getElementById("rsvpGuests").value;
    const status = document.querySelector('input[name="replyStatus"]:checked').value;
    const attending = events.length > 1 ? [...document.querySelectorAll('input[name="attendance"]:checked')].map(input => input.value) : [];
    const note = document.getElementById("rsvpMessage").value.trim();

    if (status === "attending" && events.length > 1 && !attending.length) {
      document.getElementById("rsvpNoteText").textContent = "Please select at least one event.";
      return null;
    }

    return [
      "Namaste! RSVP for Atanu & Sayanti's celebrations",
      `Name: ${name}`,
      status === "attending" ? `Number of guests: ${guests}` : "Response: Regretfully unable to attend",
      status === "attending" ? "Response: Joyfully attending" : null,
      status === "attending" && events.length > 1 ? `Attending: ${attending.join(", ")}` : null,
      note ? `Message: ${note}` : null,
      `Invitation: ${location.href}`
    ].filter(Boolean).join("\n\n");
  }

  document.querySelectorAll('input[name="replyStatus"]').forEach(input => {
    input.addEventListener("change", () => {
      const attending = document.querySelector('input[name="replyStatus"]:checked').value === "attending";
      const eventAttendance = document.getElementById("eventAttendance");
      if (eventAttendance) eventAttendance.classList.toggle("disabled-fieldset", !attending);
      document.getElementById("rsvpGuests").disabled = !attending;
      document.querySelectorAll('input[name="attendance"]').forEach(item => item.disabled = !attending);
    });
  });

  document.getElementById("rsvpForm").addEventListener("submit", event => {
    event.preventDefault();
    const message = buildRsvpMessage();
    if (!message) return;
    const number = cfg.rsvp.whatsappNumber.replace(/\D/g, "");
    const url = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });

  document.getElementById("copyRsvp").addEventListener("click", async () => {
    const message = buildRsvpMessage();
    if (!message) return;
    await navigator.clipboard.writeText(message);
    const note = document.getElementById("rsvpNoteText");
    note.textContent = "RSVP message copied. You can paste it into WhatsApp, Messenger or SMS.";
    setTimeout(() => {
      note.textContent = cfg.rsvp.whatsappNumber ? "Your RSVP will open directly in WhatsApp." : "No RSVP number is set yet, so WhatsApp will open the prepared message and let you choose the recipient.";
    }, 3500);
  });

  const music = document.getElementById("backgroundMusic");
  const musicButton = document.getElementById("musicButton");

  function setupMusic() {
    if (!cfg.musicFile) return;
    music.src = cfg.musicFile;
    musicButton.hidden = false;
  }

  async function startMusic() {
    if (!cfg.musicFile) return;
    try { await music.play(); musicButton.textContent = "Ⅱ"; } catch (_) {}
  }

  musicButton.addEventListener("click", async () => {
    if (music.paused) { await music.play(); musicButton.textContent = "Ⅱ"; }
    else { music.pause(); musicButton.textContent = "♪"; }
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  document.querySelectorAll(".gallery button").forEach(button => {
    button.addEventListener("click", () => {
      const img = button.querySelector("img");
      if (!img.complete || !img.naturalWidth) return;
      lightboxImage.src = button.dataset.full;
      lightboxImage.alt = img.alt;
      lightbox.classList.add("show");
      document.body.classList.add("locked");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.classList.remove("locked");
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  setupMusic();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();