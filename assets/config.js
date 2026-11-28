window.WEDDING_CONFIG = {
  couple: {
    groom: "Atanu Bhattacharjee",
    bride: "Sayonti Bhattacharjee",
    shortGroom: "Atanu",
    shortBride: "Sayonti",
    initials: "A&S"
  },

  weddingDate: "2026-12-13T20:00:00+06:00",

  family: {
    groom: {
      father: "Goutam Bhattacharjee",
      mother: "Khelu Bhattacharjee",
      address: "Kali Chakraborty Colony, 85 No. Alkaran, 2nd Lane, Chattogram"
    },
    bride: {
      father: "Bijoy Kumar Bhattacharjee",
      mother: "Sudipta Bhattacharjee",
      address: "Mohan Bari, Puraton Bazar, Banigram, Banshkhali, Chattogram"
    }
  },

  events: {
    wedding: {
      id: "wedding",
      icon: "rings",
      label: "Wedding Ceremony",
      date: "Sunday, 13 December 2026",
      bengaliDate: "26 Agrahayan 1433",
      dateTime: "2026-12-13T17:18:00+06:00",
      endDateTime: "2026-12-14T00:29:00+06:00",
      schedule: [
        ["Auspicious Wedding Time", "5:18 PM – 12:29 AM"],
        ["Groom's Procession", "6:30 PM"],
        ["Dinner", "8:00 PM"]
      ],
      venue: "Rajbari Convention Center",
      address: "1676/A, Shah Amanat Setu Road, Rajakhali (opposite Mir Filling Station), Chattogram",
      mapUrl: "https://maps.app.goo.gl/EjpGrSHdfWVwWM9X6"
    },

    reception: {
      id: "reception",
      icon: "diya",
      label: "Reception",
      date: "Friday, 18 December 2026",
      bengaliDate: "",
      dateTime: "2026-12-18T20:00:00+06:00",
      endDateTime: "2026-12-18T23:30:00+06:00",
      schedule: [["Dinner", "8:00 PM"]],
      venue: "Rangam Convention Hall",
      address: "Opposite Chattogram Court Building, 34 Court Road, Kotwali, Chattogram",
      mapUrl: "https://maps.app.goo.gl/9ZhGQNCjhTkjVhkY8"
    },

    colorFest: {
      id: "colorFest",
      icon: "colors",
      label: "Color Fest",
      date: "Details coming soon",
      bengaliDate: "",
      dateTime: "",
      endDateTime: "",
      schedule: [],
      venue: "Details coming soon",
      address: "",
      mapUrl: ""
    }
  },

  inviteModes: {
    wedding: ["wedding"],
    "wedding-reception": ["wedding", "reception"],
    all: ["wedding", "reception", "colorFest"]
  },

  rsvp: {
    // Recommended: paste your deployed Google Apps Script web-app URL here.
    // Example: "https://script.google.com/macros/s/ABC123/exec"
    sheetEndpoint: "https://script.google.com/macros/s/AKfycbxmNceob9HT7y89MGoZreq19yA5gpKy1u-bHESmrCGfmttOC5dr8Q5F5bb5mp1E8-wj/exec",
    intro: "Please let us know which celebrations you will be joining."
  },

  musicFile: "/assets/wedding_background.mp3",
  // 0 = mute, 1 = full volume. 0.35 is a comfortable background level.
  musicVolume: 0.35,
  // Load optimized photos first, then quietly replace them with the full originals.
  loadFullResolutionAfterInitial: true
};
