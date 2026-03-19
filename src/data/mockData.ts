export const upcomingEvents = [
  {
    id: "evergreen-estate",
    name: "Evergreen Estate Wedding",
    date: "Sat, Jun 14",
    status: "Ready to rehearse",
    phase: "Ceremony to cocktail handoff",
    venue: "Evergreen Estate",
    accent: "#25E0FF",
  },
  {
    id: "rooftop-launch",
    name: "Rooftop Brand Launch",
    date: "Thu, Jun 26",
    status: "Awaiting music upload",
    phase: "Guest arrival sound bed",
    venue: "Atlas Rooftop",
    accent: "#8B5CF6",
  },
];

export const recentTemplates = [
  {
    id: "t1",
    name: "Wedding Classic Flow",
    category: "Weddings",
    detail: "Ceremony, cocktail hour, dinner, toasts, first dance",
  },
  {
    id: "t2",
    name: "Corporate Launch Night",
    category: "Brand Events",
    detail: "Doors, keynote walk-ons, stingers, networking close",
  },
  {
    id: "t3",
    name: "Private Party Essentials",
    category: "Celebrations",
    detail: "Guest arrival, announcements, cake cue, finale",
  },
];

export const quickStartItems = [
  {
    id: "q1",
    title: "Start from template",
    description: "Clone a proven event run-of-show and swap in your own audio files.",
  },
  {
    id: "q2",
    title: "Import music pack",
    description: "Load local or uploaded tracks and attach them to event moments.",
  },
  {
    id: "q3",
    title: "Run rehearsal mode",
    description: "Preview timing, announcements, and output routing before guests arrive.",
  },
];

export const timelineMoments = [
  { id: "m1", time: "4:30 PM", title: "Guest Arrival", detail: "Ambient welcome mix", state: "armed" },
  { id: "m2", time: "5:00 PM", title: "Ceremony Start", detail: "Processional cue + mic duck", state: "scheduled" },
  { id: "m3", time: "5:28 PM", title: "Recessional", detail: "Auto crossfade into celebration track", state: "scheduled" },
  { id: "m4", time: "6:05 PM", title: "Grand Entrance", detail: "Wedding party intro announcement", state: "draft" },
];

export const playlists = [
  { id: "p1", label: "Ceremony", tracks: 8, source: "Uploaded files" },
  { id: "p2", label: "Cocktail Hour", tracks: 22, source: "Local device files" },
  { id: "p3", label: "Dinner", tracks: 17, source: "Uploaded files" },
];

export const announcements = [
  { id: "a1", title: "Guests Seated", voice: "Warm Host", timing: "2 min before processional" },
  { id: "a2", title: "Dinner Service", voice: "Venue PA", timing: "Auto after toasts" },
  { id: "a3", title: "Last Dance", voice: "CrowdKue Voice", timing: "10:55 PM" },
];

export const outputs = [
  { id: "o1", name: "Reception PA", type: "Bluetooth", status: "Connected" },
  { id: "o2", name: "Ceremony Speaker Pair", type: "Aux / Mixer", status: "Standby" },
  { id: "o3", name: "Alexa Lounge Zone", type: "Wi-Fi Relay", status: "Available" },
];
