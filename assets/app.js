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

  function compactCalendarDate(value) {
    return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function googleCalendarUrl(event) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `${event.label} — Atanu & Sayonti`,
      dates: `${compactCalendarDate(event.dateTime)}/${compactCalendarDate(event.endDateTime || event.dateTime)}`,
      details: "Celebrating Atanu Bhattacharjee and Sayonti Bhattacharjee.",
      location: [event.venue, event.address].filter(Boolean).join(", ")
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function eventCard(event) {
    const schedule = event.schedule.length
      ? `<div class="schedule">${event.schedule.map(([label, time]) => `<div class="schedule-row"><span>${esc(label)}</span><strong>${esc(time)}</strong></div>`).join("")}</div>`
      : `<p class="coming-soon">Celebration details will be shared soon.</p>`;
    const actions = [
      event.mapUrl ? `<a class="btn" href="${esc(event.mapUrl)}" target="_blank" rel="noopener">${icons.pin}<span>Open Map</span></a>` : "",
      event.dateTime ? `<a class="btn btn-outline" href="${esc(googleCalendarUrl(event))}" target="_blank" rel="noopener">${icons.calendar}<span>Add to Calendar</span></a>` : ""
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
      <div class="opening-sparkles" aria-hidden="true"></div>
      <div class="opening-mandala mandala-one" aria-hidden="true"></div>
      <div class="opening-mandala mandala-two" aria-hidden="true"></div>

      <div class="opening-stage lux-opening-stage">
        <div class="opening-om">ॐ</div>
        <p class="sacred-line">Shri Shri Prajapataye Namah</p>
        <p class="opening-small">A wedding invitation</p>
        ${guestName ? `<p class="opening-guest">For ${esc(guestName)}</p>` : ""}

        <div class="lux-envelope-scene">
          <div class="lux-aura" aria-hidden="true"></div>
          <div class="lux-light-rays" aria-hidden="true"></div>

          <article class="lux-letter" aria-hidden="true">
            <div class="lux-letter-frame"></div>
            <div class="lux-letter-lotus">${icons.lotus}</div>
            <p>Together with our families</p>
            <h1><span>${cfg.couple.shortGroom}</span><em>&</em><span>${cfg.couple.shortBride}</span></h1>
            <div class="lux-letter-rule"></div>
            <strong>13 • 12 • 2026</strong>
            <small>Chattogram</small>
          </article>

          <div class="lux-envelope" aria-hidden="true">
            <div class="lux-envelope-back"></div>

            <svg class="lux-envelope-pattern" viewBox="0 0 520 330" aria-hidden="true">
              <defs>
                <filter id="paperEmboss" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation=".45" flood-color="#fff9ea" flood-opacity=".9"/>
                  <feDropShadow dx="0" dy="-1" stdDeviation=".45" flood-color="#9f6f2c" flood-opacity=".26"/>
                </filter>
                <g id="botanicalLeft">
                  <path class="botanical-stem" d="M31 281C72 264 83 230 90 199c8-35 21-63 47-87 23-21 50-31 82-29"/>
                  <path class="botanical-stem fine" d="M54 267c28-25 40-53 43-83 4-34 19-59 46-78"/>
                  <path class="botanical-curl" d="M39 289c-10-8-10-18-2-25 8-7 20-4 22 5 2 8-4 15-13 16"/>
                  <path class="botanical-curl" d="M134 116c-9-15-5-29 8-35 12-5 25 3 25 15 0 11-9 20-21 19"/>

                  <g class="leaf-set">
                    <path class="leaf" d="M70 238c4-18 16-29 34-31 1 17-9 30-34 31Z"/>
                    <path class="vein" d="M72 236c10-9 19-17 31-27"/>
                    <path class="leaf" d="M88 201c-4-18 4-31 21-39 6 16 0 30-21 39Z"/>
                    <path class="vein" d="M90 199c5-12 10-23 18-35"/>
                    <path class="leaf" d="M108 164c3-18 14-29 32-33 2 17-8 30-32 33Z"/>
                    <path class="vein" d="M110 162c10-10 19-19 29-29"/>
                    <path class="leaf" d="M145 124c-1-16 8-28 25-34 4 15-3 27-25 34Z"/>
                    <path class="vein" d="M147 122c7-10 14-19 22-29"/>
                    <path class="leaf small" d="M55 258c-14-4-25 2-32 14 13 6 25 1 32-14Z"/>
                    <path class="vein" d="M52 259c-9 2-18 5-27 10"/>
                    <path class="leaf small" d="M99 185c12-10 25-10 37-2-9 12-22 14-37 2Z"/>
                    <path class="vein" d="M102 185c10 0 20 0 31 0"/>
                  </g>

                  <g class="flower flower-a" transform="translate(73 224)">
                    <ellipse cx="0" cy="-8" rx="4.5" ry="8"/>
                    <ellipse cx="7.5" cy="-2.5" rx="4.5" ry="8" transform="rotate(72 7.5 -2.5)"/>
                    <ellipse cx="4.5" cy="6" rx="4.5" ry="8" transform="rotate(144 4.5 6)"/>
                    <ellipse cx="-4.5" cy="6" rx="4.5" ry="8" transform="rotate(216 -4.5 6)"/>
                    <ellipse cx="-7.5" cy="-2.5" rx="4.5" ry="8" transform="rotate(288 -7.5 -2.5)"/>
                    <circle cx="0" cy="0" r="2.2"/>
                  </g>
                  <g class="flower flower-b" transform="translate(126 146) scale(.8)">
                    <ellipse cx="0" cy="-8" rx="4.5" ry="8"/>
                    <ellipse cx="7.5" cy="-2.5" rx="4.5" ry="8" transform="rotate(72 7.5 -2.5)"/>
                    <ellipse cx="4.5" cy="6" rx="4.5" ry="8" transform="rotate(144 4.5 6)"/>
                    <ellipse cx="-4.5" cy="6" rx="4.5" ry="8" transform="rotate(216 -4.5 6)"/>
                    <ellipse cx="-7.5" cy="-2.5" rx="4.5" ry="8" transform="rotate(288 -7.5 -2.5)"/>
                    <circle cx="0" cy="0" r="2.2"/>
                  </g>

                  <path class="bud" d="M164 104c5-9 12-12 20-8-1 9-7 14-17 13Z"/>
                  <path class="bud-line" d="M165 106l-13 16"/>
                  <path class="bud" d="M91 177c-9-4-14-11-11-20 9 0 15 5 17 15Z"/>
                  <path class="bud-line" d="M92 179l10 9"/>

                  <g class="mini-berries">
                    <circle cx="58" cy="247" r="2.2"/><circle cx="63" cy="251" r="1.8"/><circle cx="53" cy="253" r="1.6"/>
                    <circle cx="114" cy="174" r="1.8"/><circle cx="119" cy="177" r="1.5"/>
                  </g>
                </g>

                <g id="cornerFiligree">
                  <path d="M18 18h48c18 0 28 8 33 22"/>
                  <path d="M18 18v42c0 18 9 29 25 35"/>
                  <path d="M37 18c0 17 7 27 22 31"/>
                  <path d="M18 39c16 0 27 7 31 21"/>
                  <path d="M54 18c-1 8 3 14 10 18"/>
                  <path d="M18 53c8-1 14 3 18 10"/>
                  <circle cx="67" cy="37" r="2.3"/>
                  <circle cx="38" cy="68" r="2.3"/>
                </g>
              </defs>

              <g filter="url(#paperEmboss)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <use href="#botanicalLeft"/>
                <use href="#botanicalLeft" transform="translate(520 0) scale(-1 1)"/>
                <use href="#cornerFiligree"/>
                <use href="#cornerFiligree" transform="translate(520 0) scale(-1 1)"/>
                <use href="#cornerFiligree" transform="translate(0 330) scale(1 -1)"/>
                <use href="#cornerFiligree" transform="translate(520 330) scale(-1 -1)"/>
              </g>

              <g class="center-engraving" filter="url(#paperEmboss)" fill="none" stroke="currentColor">
                <path d="M226 74c14-17 28-25 34-25s20 8 34 25"/>
                <path d="M239 68c6-12 13-18 21-18s15 6 21 18"/>
                <path d="M260 48v27"/>
                <path d="M247 59c-9-7-17-7-24-1 6 9 14 12 24 8"/>
                <path d="M273 59c9-7 17-7 24-1-6 9-14 12-24 8"/>
                <circle cx="260" cy="48" r="2.2"/>
              </g>
            </svg>

            <div class="lux-flap">
              <svg viewBox="0 0 520 190" aria-hidden="true">
                <defs>
                  <filter id="flapEmboss" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation=".4" flood-color="#fff9ea" flood-opacity=".92"/>
                    <feDropShadow dx="0" dy="-1" stdDeviation=".4" flood-color="#9f6f2c" flood-opacity=".24"/>
                  </filter>
                  <g id="flapBranch">
                    <path class="flap-stem" d="M30 34c47 9 82 29 109 59 18 20 35 31 58 39"/>
                    <path class="flap-stem fine" d="M52 43c34 14 58 33 76 57"/>
                    <path class="flap-leaf" d="M71 53c8-13 20-18 35-15-3 14-13 21-35 15Z"/>
                    <path class="flap-vein" d="M75 52c10-4 19-8 28-12"/>
                    <path class="flap-leaf" d="M103 73c5-14 16-22 31-22 0 14-9 23-31 22Z"/>
                    <path class="flap-vein" d="M106 72c9-6 18-12 27-18"/>
                    <path class="flap-leaf" d="M135 101c0-14 8-24 23-29 4 13-2 23-23 29Z"/>
                    <path class="flap-vein" d="M137 99c6-8 12-17 19-25"/>
                    <path class="flap-bud" d="M159 119c6-8 13-10 21-6-2 9-8 13-18 11Z"/>
                    <path d="M162 120l-9 10"/>
                    <circle cx="114" cy="82" r="2"/>
                    <circle cx="121" cy="87" r="1.5"/>
                  </g>
                </defs>
                <g filter="url(#flapEmboss)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <use href="#flapBranch"/>
                  <use href="#flapBranch" transform="translate(520 0) scale(-1 1)"/>
                  <path class="flap-center" d="M232 45c10-13 20-19 28-19s18 6 28 19"/>
                  <path class="flap-center" d="M247 43c4-8 8-12 13-12s9 4 13 12"/>
                  <path class="flap-center" d="M260 26v29"/>
                  <circle cx="260" cy="26" r="2"/>
                </g>
              </svg>
            </div>

            <div class="lux-pocket-left"></div>
            <div class="lux-pocket-right"></div>
            <div class="lux-pocket-bottom"></div>
          </div>

          <button class="lux-seal" id="openInvitation" type="button" aria-label="Open wedding invitation">
            <span class="seal-heat" aria-hidden="true"></span>
            <span class="seal-half seal-half-left" aria-hidden="true"></span>
            <span class="seal-half seal-half-right" aria-hidden="true"></span>
            <span class="seal-mark">${cfg.couple.initials}</span>
            <span class="seal-crack crack-one" aria-hidden="true"></span>
            <span class="seal-crack crack-two" aria-hidden="true"></span>
            <span class="seal-flame flame-one" aria-hidden="true"></span>
            <span class="seal-flame flame-two" aria-hidden="true"></span>
            <span class="seal-flame flame-three" aria-hidden="true"></span>
            <i class="seal-ember ember-one" aria-hidden="true"></i>
            <i class="seal-ember ember-two" aria-hidden="true"></i>
            <i class="seal-ember ember-three" aria-hidden="true"></i>
            <i class="seal-ember ember-four" aria-hidden="true"></i>
          </button>
        </div>
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
        <h1>${cfg.couple.shortGroom}<span>&<b class="hero-butterfly" aria-hidden="true">
          <svg viewBox="0 0 128 86" role="presentation">
            <defs>
              <linearGradient id="butterflyWine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#fff2cf"/>
                <stop offset=".42" stop-color="#d9ad58"/>
                <stop offset="1" stop-color="#7d2437"/>
              </linearGradient>
              <linearGradient id="butterflyGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#fff7dc"/>
                <stop offset="1" stop-color="#d2a04a"/>
              </linearGradient>
            </defs>
            <g class="butterfly-wing butterfly-left-wing">
              <path d="M60 40C48 16 27 4 12 13 1 20 8 40 27 49 37 54 48 51 60 44Z" fill="url(#butterflyWine)" stroke="#f1d696" stroke-width="2"/>
              <path d="M58 46C43 47 26 51 22 64c-3 10 9 15 21 10 10-4 16-14 19-25Z" fill="#9a4350" stroke="#eacb83" stroke-width="1.7"/>
              <path d="M18 19c12 6 19 15 23 27M26 14c10 9 17 19 20 33" fill="none" stroke="#6b2332" stroke-width="1.4" opacity=".7"/>
              <circle cx="25" cy="28" r="4.5" fill="#fff0bd" opacity=".9"/>
              <circle cx="35" cy="41" r="3" fill="#f6d276" opacity=".85"/>
              <path d="M30 59c7 2 13 0 18-6" fill="none" stroke="#f2d79b" stroke-width="1.4"/>
            </g>
            <g class="butterfly-wing butterfly-right-wing">
              <path d="M68 40c12-24 33-36 48-27 11 7 4 27-15 36-10 5-21 2-33-5Z" fill="url(#butterflyWine)" stroke="#f1d696" stroke-width="2"/>
              <path d="M70 46c15 1 32 5 36 18 3 10-9 15-21 10-10-4-16-14-19-25Z" fill="#9a4350" stroke="#eacb83" stroke-width="1.7"/>
              <path d="M110 19c-12 6-19 15-23 27M102 14c-10 9-17 19-20 33" fill="none" stroke="#6b2332" stroke-width="1.4" opacity=".7"/>
              <circle cx="103" cy="28" r="4.5" fill="#fff0bd" opacity=".9"/>
              <circle cx="93" cy="41" r="3" fill="#f6d276" opacity=".85"/>
              <path d="M98 59c-7 2-13 0-18-6" fill="none" stroke="#f2d79b" stroke-width="1.4"/>
            </g>
            <path d="M64 31c-4 5-5 14-3 24 1 8 3 15 3 22 0-7 2-14 3-22 2-10 1-19-3-24Z" fill="#5f1626"/>
            <ellipse cx="64" cy="33" rx="4" ry="5" fill="url(#butterflyGold)"/>
            <path d="M62 29c-8-10-14-10-18-6M66 29c8-10 14-10 18-6" fill="none" stroke="#e6c87e" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </b></span>${cfg.couple.shortBride}</h1>
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
            <p class="rsvp-note" id="rsvpNoteText">${cfg.rsvp.sheetEndpoint ? "Your RSVP will be received privately by the couple." : "RSVP collection is not connected yet. Add the Google Sheet web-app URL in assets/config.js."}</p>
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
    if (opening.classList.contains("opening-active")) return;
    opening.classList.add("opening-active");
    startMusic();
    setTimeout(launchPetals, 5150);
    setTimeout(() => {
      document.body.classList.remove("locked");
      document.body.classList.add("invitation-open");
      flyButterfly();
      if (cfg.musicFile) musicButton.hidden = false;
    }, 5900);
    setTimeout(() => opening.classList.add("opened"), 5000);
  });

  function flyButterfly() {
    const butterfly = document.querySelector(".hero-butterfly");
    const hero = document.getElementById("home");
    if (!butterfly || !hero) return;

    butterfly.getAnimations().forEach(animation => animation.cancel());
    butterfly.style.opacity = "0";
    butterfly.style.transform = "translate3d(0,0,0)";

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      butterfly.style.opacity = "1";
      return;
    }

    const rand = (min, max) => min + Math.random() * (max - min);
    const butterflyRect = butterfly.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const startX = heroRect.left - butterflyRect.left - butterflyRect.width - rand(30, 90);
    const startY = heroRect.top + heroRect.height * rand(.48, .67) - butterflyRect.top;

    const points = [
      {x:startX, y:startY},
      {x:startX * .72, y:startY + rand(-80, 45)},
      {x:startX * .48, y:startY + rand(-35, 95)},
      {x:startX * .27, y:startY + rand(-110, 35)},
      {x:startX * .12, y:rand(-55, 50)},
      {x:rand(-28, 20), y:rand(-28, 22)},
      {x:0, y:0}
    ];

    const catmull = (p0, p1, p2, p3, t) => {
      const t2 = t * t, t3 = t2 * t;
      return {
        x:.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
        y:.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
      };
    };

    const sample = progress => {
      const count = points.length - 1;
      if (progress >= 1) return points[count];
      const scaled = progress * count;
      const i = Math.floor(scaled);
      const t = scaled - i;
      return catmull(
        points[Math.max(0,i-1)], points[i],
        points[Math.min(count,i+1)], points[Math.min(count,i+2)], t
      );
    };

    const duration = rand(4300, 5500);
    const started = performance.now();

    function frame(now) {
      const raw = Math.min(1, (now - started) / duration);
      const progress = 1 - Math.pow(1 - raw, 1.35);
      const pos = sample(progress);
      const ahead = sample(Math.min(1, progress + .008));
      const angle = Math.atan2(ahead.y - pos.y, ahead.x - pos.x) * 180 / Math.PI;
      const settle = Math.max(0, (progress - .84) / .16);
      const scale = .86 + .14 * Math.min(1, progress / .6);

      butterfly.style.opacity = String(Math.min(1, raw * 8));
      butterfly.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) rotate(${angle * (1 - settle)}deg) scale(${scale})`;

      if (raw < 1) requestAnimationFrame(frame);
      else {
        butterfly.style.opacity = "1";
        butterfly.style.transform = "translate3d(0,0,0) rotate(0deg) scale(1)";
      }
    }

    requestAnimationFrame(frame);
  }

  function launchPetals() {
    const layer = document.getElementById("petalLayer");
    if (!layer || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#f2d99f", "#d7ae58", "#fff0cf", "#c9848e"];
    for (let i = 0; i < 28; i++) {
      const petal = document.createElement("i");
      petal.className = "reveal-petal";
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
      note.textContent = "Thank you. Your RSVP has been sent.";
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
