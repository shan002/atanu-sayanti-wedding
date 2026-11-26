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
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v9H7v-7h10v7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    sparkle: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2c1.2 10.8 6 15.6 18 18-12 2.4-16.8 7.2-18 18-1.2-10.8-6-15.6-18-18C14 17.6 18.8 12.8 20 2Z" fill="currentColor"/></svg>`
  };

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const image = (optimizedName, fullName, alt, cls = "", loading = "lazy") => `<img class="${cls}" src="/images/optimized/${optimizedName}" data-full-src="/images/${fullName}" alt="${esc(alt)}" loading="${loading}" decoding="async" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src=this.dataset.fullSrc}">`;

  function eventCard(event) {
    const schedule = event.schedule.length
      ? `<div class="schedule">${event.schedule.map(([label, time]) => `<div class="schedule-row"><span>${esc(label)}</span><strong>${esc(time)}</strong></div>`).join("")}</div>`
      : `<p class="coming-soon">Celebration details will be shared soon.</p>`;
    const actions = [
      event.mapUrl ? `<a class="btn" href="${esc(event.mapUrl)}" target="_blank" rel="noopener">${icons.pin}<span>Open Map</span></a>` : "",
      event.dateTime ? `<a class="btn btn-outline" href="/calendar/${esc(event.id)}.ics">${icons.calendar}<span>Add to Calendar</span></a>` : ""
    ].join("");

    return `<article class="event-card event-${esc(event.id)} reveal">
      <div class="event-glow" aria-hidden="true"></div>
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
    return `<article class="family-card reveal">
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

  const guestGreeting = guestName ? `<div class="guest-ribbon">Dear <strong>${esc(guestName)}</strong>, this invitation is especially for you.</div>` : "";

  document.getElementById("app").innerHTML = `
    <div class="scroll-progress" aria-hidden="true"><span id="scrollProgress"></span></div>
    <div class="wedding-scroll-rail" id="weddingScrollRail" aria-hidden="true">
      <span class="rail-lotus">${icons.lotus}</span>
      <span class="rail-line"></span>
      <span class="rail-emblem" id="weddingScrollEmblem">${icons.rings}</span>
      <span class="rail-diya">${icons.diya}</span>
    </div>
    <div class="opening" id="opening">
      <div class="opening-border" aria-hidden="true"></div>
      <div class="opening-toran" aria-hidden="true"></div>
      <div class="opening-sparkles" aria-hidden="true"></div>
      <div class="hanging-garland garland-left" aria-hidden="true"></div>
      <div class="hanging-garland garland-right" aria-hidden="true"></div>
      <div class="opening-side opening-side-left" aria-hidden="true">
        <div class="side-arch"><span class="side-lotus">${icons.lotus}</span><span class="side-rings">${icons.rings}</span><span class="side-diya">${icons.diya}</span></div>
      </div>
      <div class="opening-side opening-side-right" aria-hidden="true">
        <div class="side-arch"><span class="side-lotus">${icons.lotus}</span><span class="side-rings">${icons.rings}</span><span class="side-diya">${icons.diya}</span></div>
      </div>
      <div class="opening-mandala mandala-one" aria-hidden="true"></div>
      <div class="opening-mandala mandala-two" aria-hidden="true"></div>
      <div class="opening-stage">
        <div class="opening-om">ॐ</div>
        <div class="opening-ornament">${icons.lotus}</div>
        <p class="sacred-line">Shri Shri Prajapataye Namah</p>
        <p class="opening-small">Together with our families</p>
        ${guestName ? `<p class="opening-guest">Dear ${esc(guestName)}</p>` : ""}
        <h1 class="opening-title"><span>${cfg.couple.shortGroom}</span><em>&</em><span>${cfg.couple.shortBride}</span></h1>
        <p class="opening-date">13 • 12 • 2026</p>
        <button class="grand-open-button" id="openInvitation" aria-label="Open wedding invitation">
          <span class="grand-seal">${cfg.couple.initials}</span>
          <span class="grand-open-copy">Open Invitation</span>
        </button>
        <div class="opening-diyas" aria-hidden="true"><span>◖</span><i></i><span>◗</span></div>
      </div>
    </div>

    <header class="hero" id="home">
      <div class="hero-media" aria-hidden="true">${image("hero-1600.jpg", "hero.jpg", "", "hero-image", "eager")}</div>
      <div class="hero-pattern" aria-hidden="true"></div>
      <div class="petal-layer" id="petalLayer" aria-hidden="true"></div>
      <nav class="nav">
        <a class="nav-mark" href="#home">${cfg.couple.initials}</a>
        <div class="nav-links"><a href="#story">Welcome</a><a href="#families">Families</a><a href="#events">Events</a><a href="#gallery">Gallery</a><a href="#rsvp">RSVP</a></div>
      </nav>
      <div class="hero-content reveal is-visible">
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
        <div class="intro-photo reveal">
          <div class="photo-frame">${image("couple-900.jpg", "couple.jpg", `${cfg.couple.shortGroom} and ${cfg.couple.shortBride}`, "", "eager")}</div>
          <div class="photo-flower flower-one">✦</div><div class="photo-flower flower-two">❀</div>
        </div>
        <div class="intro-copy reveal">
          <p class="kicker">A sacred beginning</p>
          <h2>Two hearts, two families, one beautiful journey.</h2>
          <p>With the blessings of Lord Prajapati and the warm wishes of our family and friends, we joyfully invite you to celebrate the union of <strong>${esc(cfg.couple.groom)}</strong> and <strong>${esc(cfg.couple.bride)}</strong>.</p>
          <div class="mini-ornament"><span></span>${icons.lotus}<span></span></div>
          <p class="signature">${cfg.couple.shortGroom} & ${cfg.couple.shortBride}</p>
        </div>
      </section>

      <section class="blessing-band reveal">
        <div class="blessing-inner"><span>✦</span><p>May this new chapter be filled with love, laughter, blessings and togetherness.</p><span>✦</span></div>
      </section>

      <section class="section center" id="families">
        <p class="kicker reveal">Together with our families</p>
        <h2 class="section-title reveal">Our Families</h2>
        <p class="section-lead reveal">Two families coming together to celebrate one cherished bond.</p>
        <div class="family-grid">
          ${familyCard("Groom", cfg.family.groom)}
          ${familyCard("Bride", cfg.family.bride)}
        </div>
        <div class="warm-invite reveal"><span>${icons.lotus}</span><p><strong>With love and warm invitation,</strong> your presence is the blessing we cherish most.</p><span>${icons.lotus}</span></div>
      </section>

      <section class="countdown-section reveal">
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

      <section class="section events-section" id="events">
        <div class="events-intro">
          <div class="events-photo reveal">${image("save-the-date-1200.jpg", "save-the-date.jpg", "Atanu and Sayonti", "", "lazy")}</div>
          <div class="events-heading reveal">
            <p class="kicker">The celebrations</p>
            <h2 class="section-title">${events.length === 1 ? "Wedding Day" : "Save the Dates"}</h2>
            <p class="section-lead">${events.length === 1 ? "We would be honored to have you with us for our wedding ceremony." : "We would be honored to celebrate these special moments with you."}</p>
            <div class="events-decoration">${icons.sparkle}${icons.lotus}${icons.sparkle}</div>
          </div>
        </div>
        <div class="event-grid">${events.map(eventCard).join("")}</div>
      </section>

      <section class="gallery-section" id="gallery">
        <div class="section center gallery-heading">
          <p class="kicker reveal">Our moments</p>
          <h2 class="section-title reveal">A Little Bit of Us</h2>
          <p class="section-lead reveal">A few memories before we begin our forever.</p>
        </div>
        <div class="gallery gallery-six">
          ${[1,2,3,4,5,6].map(i => `<button class="reveal" type="button" data-full="/images/pic-${i}.jpg">${image(`pic-${i}-900.jpg`, `pic-${i}.jpg`, `${cfg.couple.shortGroom} and ${cfg.couple.shortBride} photo ${i}`)}</button>`).join("")}
        </div>
      </section>

      <section class="section rsvp-section" id="rsvp">
        <div class="rsvp-card reveal">
          <div class="rsvp-ornament">${icons.lotus}</div>
          <p class="kicker">Kindly respond</p>
          <h2>Will you celebrate with us?</h2>
          <p>${events.length > 1 ? esc(cfg.rsvp.intro) : "Please let us know if you will be able to attend our wedding."}</p>

          <form id="rsvpForm">
            <label><span>Your name</span><input id="rsvpName" name="name" required autocomplete="name" placeholder="Enter your name" value="${esc(guestName)}"></label>

            <fieldset>
              <legend>Can you join us?</legend>
              <div class="attendance-choice">
                <label><input type="radio" name="status" value="attending" checked><span>Joyfully attending</span></label>
                <label><input type="radio" name="status" value="not-attending"><span>Regretfully unable to attend</span></label>
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
              <button class="rsvp-submit" id="rsvpSubmit" type="submit"><span>Send RSVP</span><span aria-hidden="true">→</span></button>
              <button class="rsvp-copy" id="rsvpCopy" type="button">Copy RSVP</button>
            </div>
            <p class="rsvp-note" id="rsvpNoteText">${cfg.rsvp.sheetEndpoint ? "Your response will be saved privately to the wedding RSVP sheet." : "RSVP collection is not connected yet. Add the Google Sheet web-app URL in assets/config.js."}</p>
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
    <audio id="backgroundMusic" preload="metadata"></audio>
    <div class="lightbox" id="lightbox"><button class="lightbox-close" id="lightboxClose" type="button" aria-label="Close photo">×</button><img id="lightboxImage" alt=""></div>
  `;

  const opening = document.getElementById("opening");
  const openInvitation = document.getElementById("openInvitation");
  openInvitation.addEventListener("click", () => {
    opening.classList.add("opening-active");
    launchPetals();
    startMusic();
    setTimeout(() => {
      opening.classList.add("opened");
      document.body.classList.remove("locked");
      document.body.classList.add("invitation-open");
      if (cfg.musicFile) musicButton.hidden = false;
    }, 900);
  });

  function launchPetals() {
    const layer = document.getElementById("petalLayer");
    if (!layer || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#e99b2d", "#f2b83f", "#d86535", "#ffcf61"];
    for (let i = 0; i < 28; i++) {
      const petal = document.createElement("i");
      petal.className = "marigold-petal";
      petal.style.setProperty("--x", `${Math.random()*100}%`);
      petal.style.setProperty("--size", `${7 + Math.random()*9}px`);
      petal.style.setProperty("--delay", `${Math.random()*1.5}s`);
      petal.style.setProperty("--drift", `${-70 + Math.random()*140}px`);
      petal.style.setProperty("--spin", `${180 + Math.random()*540}deg`);
      petal.style.background = colors[Math.floor(Math.random()*colors.length)];
      layer.appendChild(petal);
      setTimeout(() => petal.remove(), 7200);
    }
  }

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

  document.querySelectorAll('input[name="status"]').forEach(input => {
    input.addEventListener("change", () => {
      const attending = document.querySelector('input[name="status"]:checked').value === "attending";
      const eventAttendance = document.getElementById("eventAttendance");
      if (eventAttendance) eventAttendance.classList.toggle("disabled-fieldset", !attending);
      document.querySelectorAll('input[name="attendance"]').forEach(item => item.disabled = !attending);
    });
  });

  document.getElementById("rsvpCopy").addEventListener("click", async () => {
    const note = document.getElementById("rsvpNoteText");
    const name = document.getElementById("rsvpName").value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    const attending = events.length > 1 ? [...document.querySelectorAll('input[name="attendance"]:checked')].map(input => input.value) : (status === "attending" ? [events[0].label] : []);
    const message = document.getElementById("rsvpMessage").value.trim();

    if (!name) {
      note.textContent = "Please enter your name before copying the RSVP.";
      document.getElementById("rsvpName").focus();
      return;
    }
    if (status === "attending" && events.length > 1 && !attending.length) {
      note.textContent = "Please select at least one event.";
      return;
    }

    const text = [
      "Atanu & Sayonti — RSVP",
      "",
      `Name: ${name}`,
      `Response: ${status === "attending" ? "Joyfully attending" : "Regretfully unable to attend"}`,
      status === "attending" ? `Celebrations: ${attending.join(" • ")}` : null,
      message ? `Message: ${message}` : null,
      "",
      `Invitation: ${location.href}`
    ].filter(line => line !== null).join("\n");

    try {
      await navigator.clipboard.writeText(text);
      note.textContent = "RSVP copied to your clipboard.";
    } catch (_) {
      note.textContent = "Could not copy automatically. Please try again.";
    }
  });

  document.getElementById("rsvpForm").addEventListener("submit", async event => {
    event.preventDefault();
    const note = document.getElementById("rsvpNoteText");
    const button = document.getElementById("rsvpSubmit");
    const name = document.getElementById("rsvpName").value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    const attending = events.length > 1 ? [...document.querySelectorAll('input[name="attendance"]:checked')].map(input => input.value) : (status === "attending" ? [events[0].label] : []);
    const message = document.getElementById("rsvpMessage").value.trim();

    if (status === "attending" && events.length > 1 && !attending.length) {
      note.textContent = "Please select at least one event.";
      return;
    }
    if (!cfg.rsvp.sheetEndpoint) {
      note.textContent = "RSVP is not connected yet. Add the Google Apps Script web-app URL in assets/config.js.";
      return;
    }

    const payload = new URLSearchParams({
      name,
      status,
      events: attending.join(", "),
      message,
      invitation: mode,
      guestLinkName: guestName,
      pageUrl: location.href
    });

    button.disabled = true;
    button.querySelector("span").textContent = "Sending...";
    note.textContent = "Saving your response...";
    try {
      await fetch(cfg.rsvp.sheetEndpoint, {method:"POST", mode:"no-cors", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:payload});
      button.querySelector("span").textContent = "RSVP Sent ✓";
      note.textContent = "Thank you. Your RSVP has been recorded.";
      event.target.reset();
    } catch (_) {
      button.disabled = false;
      button.querySelector("span").textContent = "Send RSVP";
      note.textContent = "We could not save the response. Please try again.";
    }
  });

  const music = document.getElementById("backgroundMusic");
  const musicButton = document.getElementById("musicButton");
  let userPausedMusic = false;

  function setupMusic() {
    if (!cfg.musicFile) return;
    music.src = cfg.musicFile;
    music.preload = "auto";
    music.loop = true;
    music.volume = Math.max(0, Math.min(1, Number(cfg.musicVolume ?? 0.35)));
    music.load();
  }

  async function startMusic() {
    if (!cfg.musicFile || userPausedMusic || document.hidden) return;
    try {
      await music.play();
      musicButton.textContent = "Ⅱ";
    } catch (_) {}
  }

  function stopMusicForExit() {
    if (!music.paused) music.pause();
    musicButton.textContent = "♪";
  }

  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      userPausedMusic = false;
      await startMusic();
    } else {
      userPausedMusic = true;
      stopMusicForExit();
    }
  });

  document.addEventListener("visibilitychange", () => { if (document.hidden) stopMusicForExit(); });
  window.addEventListener("pagehide", stopMusicForExit);
  window.addEventListener("beforeunload", stopMusicForExit);
  window.addEventListener("blur", stopMusicForExit);

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

  function closeLightbox() { lightbox.classList.remove("show"); document.body.classList.remove("locked"); }
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {threshold:.14, rootMargin:"0px 0px -30px"});
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  window.addEventListener("load", () => {
    if (!cfg.loadFullResolutionAfterInitial) return;
    const upgrade = () => {
      const images = [...document.querySelectorAll("img[data-full-src]")];
      let index = 0;
      const next = () => {
        const img = images[index++];
        if (!img) return;
        const full = new Image();
        full.onload = () => { img.src = img.dataset.fullSrc; setTimeout(next, 120); };
        full.onerror = () => setTimeout(next, 120);
        full.src = img.dataset.fullSrc;
      };
      next();
    };
    if ("requestIdleCallback" in window) requestIdleCallback(upgrade, {timeout:2500});
    else setTimeout(upgrade, 900);
  });

  const scrollProgress = document.getElementById("scrollProgress");
  let scrollTicking = false;
  function updateScrollProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0;
    scrollProgress.style.width = `${progress}%`;
    const emblem = document.getElementById("weddingScrollEmblem");
    if (emblem) {
      emblem.style.top = `${11 + progress * .78}vh`;
      emblem.style.transform = `translateY(-50%) rotate(${progress * 2.2}deg)`;
    }
    scrollTicking = false;
  }
  addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollProgress);
  }, {passive:true});
  updateScrollProgress();

  setupMusic();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
