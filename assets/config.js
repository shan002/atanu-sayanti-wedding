window.WEDDING_CONFIG = {
  couple: {
    groom: "Atanu Bhattacharjee",
    bride: "Sayanti Bhattacharjee",
    shortGroom: "Atanu",
    shortBride: "Sayanti",
    initials: "A&S"
  },

  weddingDate: "2026-12-13T17:18:00+06:00",

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
    },
    hosts: [
      { name: "Goutam Bhattacharjee", relation: "Groom's Father" },
      { name: "Khelu Bhattacharjee", relation: "Groom's Mother" },
      { name: "Arati Chakraborty", relation: "Grandmother" }
    ]
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
    // Optional but recommended. Digits only, including country code.
    // Example Bangladesh: "88017XXXXXXXX"
    whatsappNumber: "", // Add the family RSVP number here when decided.
    intro: "Please let us know which celebrations you will be joining."
  },

  musicFile: "/assets/wedding_background.mp3"
};