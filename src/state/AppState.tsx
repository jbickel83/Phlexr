import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Audio, AVPlaybackStatus } from "expo-av";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

const STORAGE_KEY = "crowdkue.mpp.local-state.v1";
const AUTOPILOT_COUNTDOWN_SECONDS = 8;
const canUseNativeAudio = Platform.OS !== "web";
const canUseSpeechSynthesis = typeof window !== "undefined" && "speechSynthesis" in window;

export type EventDetails = {
  name: string;
  type: string;
  date: string;
  startTime: string;
  location: string;
  packageType: string;
  status: string;
};

export type TimelineItem = {
  id: string;
  title: string;
  time: string;
  music: string;
  announcementAttached: boolean;
};

export type Song = {
  id: string;
  title: string;
  songName?: string;
  artist?: string;
  duration: string;
  fileType: string;
  uri?: string;
  durationMillis?: number;
};

export type Playlist = {
  id: string;
  name: string;
  detail: string;
  songIds: string[];
};

export type Announcement = {
  id: string;
  title: string;
  timelineMoment: string;
  previewText: string;
};

export type SavedEventRecord = {
  id: string;
  event: EventDetails;
  timelineItems: TimelineItem[];
  songs: Song[];
  playlists: Playlist[];
  announcements: Announcement[];
  updatedAt: string;
};

export type LiveAnnouncementState = "pending" | "active" | "completed" | "idle";
export type ValidationResponse = "Yes" | "Maybe" | "No";

export type FeedbackEntry = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type ValidationEntry = {
  id: string;
  eventId: string | null;
  response: ValidationResponse;
  comment: string;
  createdAt: string;
};

type DraftAnnouncement = {
  title: string;
  messageText: string;
  timelineMoment: string;
};

type LocalAudioFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

type AppStateValue = {
  currentEvent: EventDetails;
  selectedEventId: string | null;
  savedEvents: SavedEventRecord[];
  timelineItems: TimelineItem[];
  songs: Song[];
  playlists: Playlist[];
  announcements: Announcement[];
  persistenceMessage: string | null;
  isHydrating: boolean;
  isOnline: boolean;
  selectedOutputLabel: string | null;
  liveIndex: number;
  autopilotRunning: boolean;
  manualOverride: boolean;
  countdownSeconds: number;
  activeAnnouncementTitle: string | null;
  announcementState: LiveAnnouncementState;
  currentAnnouncementText: string | null;
  nextAnnouncementTitle: string | null;
  nextAnnouncementText: string | null;
  currentTrackName: string | null;
  playbackState: "idle" | "playing" | "paused" | "warning";
  playbackPositionMillis: number;
  playbackDurationMillis: number;
  audioWarning: string | null;
  currentTrackFallback: string | null;
  availableVoiceNames: string[];
  selectedVoiceName: string | null;
  speechRate: number;
  speechSupported: boolean;
  speechSpeaking: boolean;
  speechMessage: string | null;
  feedbackEntries: FeedbackEntry[];
  validationEntries: ValidationEntry[];
  beginNewEventDraft: () => void;
  startDemoEvent: () => void;
  selectSavedEvent: (id: string) => void;
  saveCurrentEventSnapshot: (eventOverrides?: Partial<EventDetails>) => string | null;
  updateEvent: (payload: Partial<EventDetails>) => void;
  setSelectedOutputLabel: (label: string | null) => void;
  addTimelineItem: (payload?: Partial<TimelineItem>) => void;
  updateTimelineItem: (id: string, payload: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  reorderTimelineItems: () => void;
  addSong: (payload?: Partial<Song>) => void;
  importLocalSong: (file: LocalAudioFile) => Promise<void>;
  deleteSong: (id: string) => void;
  reorderSongs: () => void;
  createPlaylist: (name?: string) => void;
  assignSongsToPlaylist: () => void;
  addSongToPlaylist: (playlistId: string, payload: { title: string; artist?: string; duration?: string }) => void;
  deleteSongFromPlaylist: (playlistId: string, songId: string) => void;
  moveSongInPlaylist: (playlistId: string, songId: string, direction: "up" | "down") => void;
  addAnnouncement: (draft: DraftAnnouncement) => void;
  updateAnnouncement: (id: string, draft: DraftAnnouncement) => void;
  deleteAnnouncement: (id: string) => void;
  startAutopilot: () => void;
  pauseAutopilot: () => void;
  resumeAutopilot: () => void;
  skipToNextTimelineItem: () => void;
  goToPreviousTimelineItem: () => void;
  restartCurrentTimelineItem: () => void;
  toggleManualOverride: () => void;
  triggerManualAnnouncement: () => void;
  dismissAnnouncement: () => void;
  speakAnnouncement: (payload: { title?: string; text: string }) => void;
  stopAnnouncementSpeech: () => void;
  setSelectedVoiceName: (voiceName: string | null) => void;
  setSpeechRate: (rate: number) => void;
  resetLiveProgress: () => void;
  submitFeedback: (payload: { name?: string; email?: string; message: string }) => void;
  submitValidationResponse: (payload: { response: ValidationResponse; comment?: string }) => void;
};

type PersistedPayload = {
  version: 1;
  savedEvents: SavedEventRecord[];
  selectedEventId: string | null;
  selectedOutputLabel?: string | null;
  selectedVoiceName?: string | null;
  speechRate?: number;
  feedbackEntries?: FeedbackEntry[];
  validationEntries?: ValidationEntry[];
};

const draftEvent: EventDetails = {
  name: "",
  type: "Wedding",
  date: "",
  startTime: "",
  location: "",
  packageType: "Signature",
  status: "Draft Event",
};

const demoEventRecord: SavedEventRecord = {
  id: "demo-event",
  event: {
    name: "Jordan & Avery Wedding",
    type: "Wedding",
    date: "Saturday, June 14",
    startTime: "4:30 PM",
    location: "Evergreen Estate",
    packageType: "Signature",
    status: "Demo Event Ready",
  },
  timelineItems: [
    { id: "demo-t1", title: "Guest Arrival", time: "4:00 PM", music: "Cocktail Hour", announcementAttached: false },
    { id: "demo-t2", title: "Ceremony Processional", time: "4:30 PM", music: "Canon in D", announcementAttached: false },
    { id: "demo-t3", title: "Grand Entrance", time: "6:05 PM", music: "Grand Entrance Mix", announcementAttached: true },
    { id: "demo-t4", title: "Dinner Service", time: "6:40 PM", music: "Dinner Set", announcementAttached: true },
    { id: "demo-t5", title: "First Dance", time: "7:20 PM", music: "Perfect", announcementAttached: true },
  ],
  songs: [
    { id: "demo-s1", title: "Canon in D", songName: "Canon in D", artist: "Pachelbel Ensemble", duration: "3:45", fileType: "MP3", durationMillis: 225000 },
    { id: "demo-s2", title: "Grand Entrance Mix", songName: "Grand Entrance Mix", artist: "CrowdKue Edit", duration: "2:12", fileType: "WAV", durationMillis: 132000 },
    { id: "demo-s3", title: "Perfect", songName: "Perfect", artist: "Ed Sheeran", duration: "4:23", fileType: "MP3", durationMillis: 263000 },
    { id: "demo-s4", title: "Dinner Jazz Set", songName: "Dinner Jazz Set", artist: "House Ensemble", duration: "18:40", fileType: "MP3", durationMillis: 1120000 },
  ],
  playlists: [
    { id: "demo-p1", name: "Cocktail Hour", detail: "Ambient welcome and mingle music.", songIds: ["demo-s4"] },
    { id: "demo-p2", name: "Dinner Set", detail: "Low-volume dinner background tracks.", songIds: ["demo-s4"] },
  ],
  announcements: [
    {
      id: "demo-a1",
      title: "Grand Entrance",
      timelineMoment: "Grand Entrance",
      previewText: "Please welcome Jordan, Avery, and their wedding party to the ballroom.",
    },
    {
      id: "demo-a2",
      title: "Dinner Service",
      timelineMoment: "Dinner Service",
      previewText: "Dinner is now being served. Please enjoy your meal and remain seated for the next toast.",
    },
    {
      id: "demo-a3",
      title: "First Dance",
      timelineMoment: "First Dance",
      previewText: "Please gather around the dance floor for Jordan and Avery's first dance.",
    },
  ],
  updatedAt: "2026-03-18T12:00:00.000Z",
};

const AppStateContext = createContext<AppStateValue | null>(null);

function formatDurationFromMillis(durationMillis?: number) {
  if (!durationMillis || durationMillis <= 0) {
    return "0:00";
  }
  const totalSeconds = Math.floor(durationMillis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function createPlaylistDetail(songCount: number) {
  if (songCount <= 0) {
    return "No songs added yet.";
  }
  if (songCount === 1) {
    return "1 song ready in this playlist.";
  }
  return `${songCount} songs ready in this playlist.`;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseTimeValue(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  const normalizedHours = (hours % 12) + (meridiem === "PM" ? 12 : 0);
  return normalizedHours * 60 + minutes;
}

function cloneSnapshot(record: SavedEventRecord) {
  return {
    event: { ...record.event },
    timelineItems: record.timelineItems.map((item) => ({ ...item })),
    songs: record.songs.map((song) => ({ ...song })),
    playlists: record.playlists.map((playlist) => ({ ...playlist, songIds: [...playlist.songIds] })),
    announcements: record.announcements.map((announcement) => ({ ...announcement })),
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function normalizeEventDetails(value: unknown): EventDetails {
  const record = typeof value === "object" && value ? (value as Partial<EventDetails>) : {};
  return {
    name: typeof record.name === "string" ? record.name : draftEvent.name,
    type: typeof record.type === "string" ? record.type : draftEvent.type,
    date: typeof record.date === "string" ? record.date : draftEvent.date,
    startTime: typeof record.startTime === "string" ? record.startTime : draftEvent.startTime,
    location: typeof record.location === "string" ? record.location : draftEvent.location,
    packageType: typeof record.packageType === "string" ? record.packageType : draftEvent.packageType,
    status: typeof record.status === "string" ? record.status : draftEvent.status,
  };
}

function normalizeTimelineItems(value: unknown): TimelineItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const record = item as Partial<TimelineItem>;
    return [
      {
        id: isNonEmptyString(record.id) ? record.id : createId(`timeline-${index}`),
        title: typeof record.title === "string" ? record.title : `Timeline Item ${index + 1}`,
        time: typeof record.time === "string" ? record.time : "",
        music: typeof record.music === "string" ? record.music : "",
        announcementAttached: Boolean(record.announcementAttached),
      },
    ];
  });
}

function normalizeSongs(value: unknown): Song[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const record = item as Partial<Song>;
    const nextTitle =
      typeof record.title === "string"
        ? record.title
        : typeof record.songName === "string"
          ? record.songName
          : `Track ${index + 1}`;
    return [
      {
        id: isNonEmptyString(record.id) ? record.id : createId(`song-${index}`),
        title: nextTitle,
        songName: nextTitle,
        artist: typeof record.artist === "string" ? record.artist : "",
        duration: typeof record.duration === "string" ? record.duration : "0:00",
        fileType: typeof record.fileType === "string" ? record.fileType : "FILE",
        uri: typeof record.uri === "string" ? record.uri : undefined,
        durationMillis: typeof record.durationMillis === "number" ? record.durationMillis : undefined,
      },
    ];
  });
}

function normalizePlaylists(value: unknown): Playlist[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const record = item as Partial<Playlist>;
    return [
      {
        id: isNonEmptyString(record.id) ? record.id : createId(`playlist-${index}`),
        name: typeof record.name === "string" ? record.name : `Playlist ${index + 1}`,
        detail: typeof record.detail === "string" ? record.detail : "Playlist ready for event use.",
        songIds: Array.isArray(record.songIds) ? record.songIds.filter((songId): songId is string => typeof songId === "string") : [],
      },
    ];
  });
}

function normalizeAnnouncements(value: unknown): Announcement[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const record = item as Partial<Announcement>;
    return [
      {
        id: isNonEmptyString(record.id) ? record.id : createId(`announcement-${index}`),
        title: typeof record.title === "string" ? record.title : `Announcement ${index + 1}`,
        timelineMoment: typeof record.timelineMoment === "string" ? record.timelineMoment : "No assignment",
        previewText: typeof record.previewText === "string" ? record.previewText : "",
      },
    ];
  });
}

function normalizeSavedEvents(value: unknown): SavedEventRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const record = item as Partial<SavedEventRecord>;
    return [
      {
        id: isNonEmptyString(record.id) ? record.id : createId(`event-${index}`),
        event: normalizeEventDetails(record.event),
        timelineItems: normalizeTimelineItems(record.timelineItems),
        songs: normalizeSongs(record.songs),
        playlists: normalizePlaylists(record.playlists),
        announcements: normalizeAnnouncements(record.announcements),
        updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date().toISOString(),
      },
    ];
  });
}

function normalizeFeedbackEntries(value: unknown): FeedbackEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const record = item as Partial<FeedbackEntry>;
    return [
      {
        id: isNonEmptyString(record.id) ? record.id : createId(`feedback-${index}`),
        name: typeof record.name === "string" ? record.name : "",
        email: typeof record.email === "string" ? record.email : "",
        message: typeof record.message === "string" ? record.message : "",
        createdAt: typeof record.createdAt === "string" ? record.createdAt : new Date().toISOString(),
      },
    ];
  });
}

function normalizeValidationEntries(value: unknown): ValidationEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const record = item as Partial<ValidationEntry>;
    return [
      {
        id: isNonEmptyString(record.id) ? record.id : createId(`validation-${index}`),
        eventId: typeof record.eventId === "string" ? record.eventId : null,
        response:
          record.response === "Yes" || record.response === "Maybe" || record.response === "No"
            ? record.response
            : "Maybe",
        comment: typeof record.comment === "string" ? record.comment : "",
        createdAt: typeof record.createdAt === "string" ? record.createdAt : new Date().toISOString(),
      },
    ];
  });
}

function loadRecordIntoState(record: SavedEventRecord | null) {
  if (!record) {
    return {
      event: { ...draftEvent },
      timelineItems: [] as TimelineItem[],
      songs: [] as Song[],
      playlists: [] as Playlist[],
      announcements: [] as Announcement[],
    };
  }
  return cloneSnapshot(record);
}

function getTrackFallbackMessage(timelineItem?: TimelineItem | null) {
  if (!timelineItem) {
    return null;
  }
  if (!timelineItem.music.trim() || timelineItem.music.trim() === "Select Song") {
    return "No track assigned for this timeline item. Manual control is available.";
  }
  return `Assigned track "${timelineItem.music}" could not be loaded. You can keep the event moving with manual control.`;
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [currentEvent, setCurrentEvent] = useState<EventDetails>(draftEvent);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [savedEvents, setSavedEvents] = useState<SavedEventRecord[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [persistenceMessage, setPersistenceMessage] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedOutputLabel, setSelectedOutputLabelState] = useState<string | null>(null);
  const [liveIndex, setLiveIndex] = useState(0);
  const [autopilotRunning, setAutopilotRunning] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(AUTOPILOT_COUNTDOWN_SECONDS);
  const [activeAnnouncementTitle, setActiveAnnouncementTitle] = useState<string | null>(null);
  const [announcementState, setAnnouncementState] = useState<LiveAnnouncementState>("idle");
  const [currentAnnouncementText, setCurrentAnnouncementText] = useState<string | null>(null);
  const [completedAnnouncementIds, setCompletedAnnouncementIds] = useState<string[]>([]);
  const [currentTrackName, setCurrentTrackName] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<"idle" | "playing" | "paused" | "warning">("idle");
  const [playbackPositionMillis, setPlaybackPositionMillis] = useState(0);
  const [playbackDurationMillis, setPlaybackDurationMillis] = useState(0);
  const [audioWarning, setAudioWarning] = useState<string | null>(null);
  const [currentTrackFallback, setCurrentTrackFallback] = useState<string | null>(null);
  const [availableVoiceNames, setAvailableVoiceNames] = useState<string[]>([]);
  const [selectedVoiceName, setSelectedVoiceNameState] = useState<string | null>(null);
  const [speechRate, setSpeechRateState] = useState(1);
  const [speechSpeaking, setSpeechSpeaking] = useState(false);
  const [speechMessage, setSpeechMessage] = useState<string | null>(null);
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [validationEntries, setValidationEntries] = useState<ValidationEntry[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSongIdRef = useRef<string | null>(null);
  const hasHydratedRef = useRef(false);
  const skipNextSavedSyncRef = useRef(false);

  const resetLiveRuntime = () => {
    stopAnnouncementSpeechInternal();
    setLiveIndex(0);
    setAutopilotRunning(false);
    setManualOverride(false);
    setCountdownSeconds(AUTOPILOT_COUNTDOWN_SECONDS);
    setActiveAnnouncementTitle(null);
    setAnnouncementState("idle");
    setCurrentAnnouncementText(null);
    setCompletedAnnouncementIds([]);
    setCurrentTrackName(null);
    setPlaybackState("idle");
    setPlaybackPositionMillis(0);
    setPlaybackDurationMillis(0);
    setAudioWarning(null);
    setCurrentTrackFallback(null);
  };

  const applySnapshot = (record: SavedEventRecord | null) => {
    skipNextSavedSyncRef.current = true;
    const snapshot = loadRecordIntoState(record);
    setCurrentEvent(snapshot.event);
    setTimelineItems(snapshot.timelineItems);
    setSongs(snapshot.songs);
    setPlaylists(snapshot.playlists);
    setAnnouncements(snapshot.announcements);
    resetLiveRuntime();
  };

  const upsertSavedEvent = (recordId: string, event: EventDetails) => {
    const nextRecord: SavedEventRecord = {
      id: recordId,
      event: { ...event },
      timelineItems: timelineItems.map((item) => ({ ...item })),
      songs: songs.map((song) => ({ ...song })),
      playlists: playlists.map((playlist) => ({ ...playlist, songIds: [...playlist.songIds] })),
      announcements: announcements.map((announcement) => ({ ...announcement })),
      updatedAt: new Date().toISOString(),
    };

    setSavedEvents((prev) => {
      const remaining = prev.filter((item) => item.id !== recordId);
      return [nextRecord, ...remaining];
    });
  };

  const findAnnouncementForIndex = (index: number) => {
    const timelineItem = timelineItems[index];
    if (!timelineItem?.announcementAttached) {
      return null;
    }
    return announcements.find((item) => item.timelineMoment === timelineItem.title) ?? null;
  };

  const triggerAnnouncementForIndex = (index: number) => {
    const matchingAnnouncement = findAnnouncementForIndex(index);
    if (!matchingAnnouncement) {
      setActiveAnnouncementTitle(null);
      setCurrentAnnouncementText(null);
      setAnnouncementState("idle");
      return;
    }
    setActiveAnnouncementTitle(matchingAnnouncement.title);
    setCurrentAnnouncementText(matchingAnnouncement.previewText);
    setAnnouncementState("active");
    speakAnnouncementInternal({
      title: matchingAnnouncement.title,
      text: matchingAnnouncement.previewText,
      markCompleted: true,
    });
  };

  const dismissCurrentAnnouncement = () => {
    const matchingAnnouncement = findAnnouncementForIndex(liveIndex);
    if (!matchingAnnouncement) {
      stopAnnouncementSpeechInternal();
      setActiveAnnouncementTitle(null);
      setCurrentAnnouncementText(null);
      setAnnouncementState("idle");
      return;
    }
    stopAnnouncementSpeechInternal();
    setCompletedAnnouncementIds((prev) =>
      prev.includes(matchingAnnouncement.id) ? prev : [...prev, matchingAnnouncement.id],
    );
    setActiveAnnouncementTitle(matchingAnnouncement.title);
    setCurrentAnnouncementText(matchingAnnouncement.previewText);
    setAnnouncementState("completed");
  };

  function stopAnnouncementSpeechInternal() {
    if (!canUseSpeechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    speechUtteranceRef.current = null;
    setSpeechSpeaking(false);
    setSpeechMessage(null);
  }

  function speakAnnouncementInternal({ title, text, markCompleted = false }: { title?: string; text: string; markCompleted?: boolean }) {
    if (!text.trim()) {
      return;
    }

    if (!canUseSpeechSynthesis) {
      setSpeechMessage("Voice playback is not available on this device or browser.");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      setSpeechMessage("No speech voice is currently available. You can still run the event manually.");
      return;
    }

    stopAnnouncementSpeechInternal();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    const selectedVoice = selectedVoiceName ? voices.find((voice) => voice.name === selectedVoiceName) : null;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      setSpeechSpeaking(true);
      setSpeechMessage(title ? `Speaking ${title}.` : "Speaking announcement.");
    };
    utterance.onend = () => {
      speechUtteranceRef.current = null;
      setSpeechSpeaking(false);
      setSpeechMessage(null);
      if (markCompleted) {
        dismissCurrentAnnouncement();
      }
    };
    utterance.onerror = () => {
      speechUtteranceRef.current = null;
      setSpeechSpeaking(false);
      setSpeechMessage("Announcement voice playback could not start on this device.");
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  const resolveSongForTimelineItem = (timelineItem?: TimelineItem | null) => {
    if (!timelineItem?.music) {
      return null;
    }
    const directSong = songs.find((song) => (song.title || song.songName) === timelineItem.music);
    if (directSong) {
      return directSong;
    }
    const playlist = playlists.find((item) => item.name === timelineItem.music);
    if (!playlist) {
      return null;
    }
    const firstSongId = playlist.songIds[0];
    return songs.find((song) => song.id === firstSongId) ?? null;
  };

  const unloadCurrentSound = async () => {
    if (!canUseNativeAudio) {
      return;
    }
    if (!soundRef.current) {
      return;
    }
    try {
      await soundRef.current.unloadAsync();
    } catch {
      // noop for MVP cleanup
    }
    soundRef.current.setOnPlaybackStatusUpdate(null);
    soundRef.current = null;
    currentSongIdRef.current = null;
  };

  const syncPlaybackStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setPlaybackState("warning");
      return;
    }
    setPlaybackPositionMillis(status.positionMillis ?? 0);
    setPlaybackDurationMillis(status.durationMillis ?? 0);
    setPlaybackState(status.isPlaying ? "playing" : "paused");
  };

  const playResolvedSong = async (timelineItem?: TimelineItem | null) => {
    const resolvedSong = resolveSongForTimelineItem(timelineItem);

    if (!timelineItem) {
      setCurrentTrackName(null);
      setPlaybackState("idle");
      setAudioWarning(null);
      setCurrentTrackFallback(null);
      await unloadCurrentSound();
      return;
    }

    if (!resolvedSong) {
      setCurrentTrackName(timelineItem.music || "Unassigned");
      setPlaybackState("warning");
      setPlaybackPositionMillis(0);
      setPlaybackDurationMillis(0);
      setAudioWarning("CrowdKue could not find a playable local track for this cue.");
      setCurrentTrackFallback(getTrackFallbackMessage(timelineItem));
      await unloadCurrentSound();
      return;
    }

    setCurrentTrackName(resolvedSong.title || resolvedSong.songName || null);

    if (!canUseNativeAudio) {
      setPlaybackState("playing");
      setPlaybackPositionMillis((prev) => (currentTrackName === (resolvedSong.title || resolvedSong.songName) ? prev : 0));
      setPlaybackDurationMillis(resolvedSong.durationMillis ?? 0);
      setAudioWarning(null);
      setCurrentTrackFallback(null);
      return;
    }

    if (!resolvedSong.uri) {
      if (currentEvent.status.toLowerCase().includes("demo event")) {
        setPlaybackState("playing");
        setPlaybackPositionMillis((prev) =>
          currentTrackName === (resolvedSong.title || resolvedSong.songName) ? prev : 0,
        );
        setPlaybackDurationMillis(resolvedSong.durationMillis ?? 0);
        setAudioWarning(null);
        setCurrentTrackFallback(null);
        await unloadCurrentSound();
        return;
      }
      setPlaybackState("warning");
      setPlaybackPositionMillis(0);
      setPlaybackDurationMillis(resolvedSong.durationMillis ?? 0);
      setAudioWarning("This track was restored from local metadata and may need to be re-selected on this device.");
      setCurrentTrackFallback(getTrackFallbackMessage(timelineItem));
      await unloadCurrentSound();
      return;
    }

    setAudioWarning(null);
    setCurrentTrackFallback(null);

    if (currentSongIdRef.current === resolvedSong.id && soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await soundRef.current.playAsync();
      }
      return;
    }

    await unloadCurrentSound();

    try {
      const sound = new Audio.Sound();
      soundRef.current = sound;
      currentSongIdRef.current = resolvedSong.id;
      sound.setOnPlaybackStatusUpdate(syncPlaybackStatus);
      await sound.loadAsync({ uri: resolvedSong.uri }, { shouldPlay: true });
      setPlaybackDurationMillis(resolvedSong.durationMillis ?? 0);
      setPlaybackState("playing");
    } catch {
      setPlaybackState("warning");
      setAudioWarning("CrowdKue could not load this local audio file.");
      setCurrentTrackFallback(getTrackFallbackMessage(timelineItem));
      await unloadCurrentSound();
    }
  };

  useEffect(() => {
    if (canUseNativeAudio && typeof Audio.setAudioModeAsync === "function") {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      }).catch(() => undefined);
    }

    return () => {
      unloadCurrentSound().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const nextOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(nextOnline);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!canUseSpeechSynthesis) {
      return;
    }

    const syncVoices = () => {
      const voiceNames = window.speechSynthesis
        .getVoices()
        .map((voice) => voice.name)
        .filter(Boolean);
      setAvailableVoiceNames(voiceNames);
      setSelectedVoiceNameState((prev) => (prev && voiceNames.includes(prev) ? prev : voiceNames[0] ?? null));
    };

    syncVoices();
    window.speechSynthesis.onvoiceschanged = syncVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrateState = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (!raw) {
          if (!cancelled) {
            setIsHydrating(false);
            hasHydratedRef.current = true;
          }
          return;
        }

        const parsed = JSON.parse(raw) as Partial<PersistedPayload>;
        const nextSavedEvents = normalizeSavedEvents(parsed.savedEvents);
        const requestedId = typeof parsed.selectedEventId === "string" ? parsed.selectedEventId : null;
        const selectedRecord =
          nextSavedEvents.find((item) => item.id === requestedId) ?? nextSavedEvents[0] ?? null;

        if (cancelled) {
          return;
        }

        setSavedEvents(nextSavedEvents);
        setSelectedEventId(selectedRecord?.id ?? null);
        setSelectedOutputLabelState(
          typeof parsed.selectedOutputLabel === "string" ? parsed.selectedOutputLabel : null,
        );
        setSelectedVoiceNameState(typeof parsed.selectedVoiceName === "string" ? parsed.selectedVoiceName : null);
        setSpeechRateState(typeof parsed.speechRate === "number" ? parsed.speechRate : 1);
        setFeedbackEntries(normalizeFeedbackEntries(parsed.feedbackEntries));
        setValidationEntries(normalizeValidationEntries(parsed.validationEntries));
        applySnapshot(selectedRecord);
        setIsHydrating(false);
        hasHydratedRef.current = true;
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined);
        if (!cancelled) {
          setPersistenceMessage("Saved local CrowdKue data was corrupted and has been safely reset.");
          setSavedEvents([]);
          setSelectedEventId(null);
          applySnapshot(null);
          setIsHydrating(false);
          hasHydratedRef.current = true;
        }
      }
    };

    hydrateState().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current || !selectedEventId) {
      return;
    }

    if (skipNextSavedSyncRef.current) {
      skipNextSavedSyncRef.current = false;
      return;
    }

    const updatedAt = new Date().toISOString();
    setSavedEvents((prev) => {
      const existing = prev.find((item) => item.id === selectedEventId);
      if (!existing) {
        return prev;
      }
      const synced: SavedEventRecord = {
        id: selectedEventId,
        event: { ...currentEvent },
        timelineItems: timelineItems.map((item) => ({ ...item })),
        songs: songs.map((song) => ({ ...song })),
        playlists: playlists.map((playlist) => ({ ...playlist, songIds: [...playlist.songIds] })),
        announcements: announcements.map((announcement) => ({ ...announcement })),
        updatedAt,
      };
      const remaining = prev.filter((item) => item.id !== selectedEventId);
      return [synced, ...remaining];
    });
  }, [announcements, currentEvent, playlists, selectedEventId, songs, timelineItems]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    const payload: PersistedPayload = {
      version: 1,
      savedEvents,
      selectedEventId,
      selectedOutputLabel,
      selectedVoiceName,
      speechRate,
      feedbackEntries,
      validationEntries,
    };

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {
      setPersistenceMessage("CrowdKue could not save changes locally on this device.");
    });
  }, [feedbackEntries, savedEvents, selectedEventId, selectedOutputLabel, selectedVoiceName, speechRate, validationEntries]);

  useEffect(() => {
    if (!autopilotRunning || manualOverride || timelineItems.length === 0 || speechSpeaking) {
      return;
    }

    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        setLiveIndex((current) => {
          if (current >= timelineItems.length - 1) {
            setAutopilotRunning(false);
            return current;
          }
          return current + 1;
        });

        return AUTOPILOT_COUNTDOWN_SECONDS;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autopilotRunning, manualOverride, speechSpeaking, timelineItems.length]);

  useEffect(() => {
    const currentTimelineItem = timelineItems[liveIndex] ?? null;
    const matchingAnnouncement = findAnnouncementForIndex(liveIndex);
    if (matchingAnnouncement) {
      if (completedAnnouncementIds.includes(matchingAnnouncement.id)) {
        setActiveAnnouncementTitle(matchingAnnouncement.title);
        setCurrentAnnouncementText(matchingAnnouncement.previewText);
        setAnnouncementState("completed");
      } else {
        triggerAnnouncementForIndex(liveIndex);
      }
    } else {
      setActiveAnnouncementTitle(null);
      setCurrentAnnouncementText(null);
      setAnnouncementState("idle");
    }
    setCountdownSeconds(AUTOPILOT_COUNTDOWN_SECONDS);

    if (autopilotRunning && !manualOverride) {
      playResolvedSong(currentTimelineItem).catch(() => undefined);
    }
  }, [autopilotRunning, completedAnnouncementIds, liveIndex, manualOverride]);

  useEffect(() => {
    if (speechSpeaking) {
      if (soundRef.current) {
        soundRef.current.pauseAsync().catch(() => undefined);
      }
      setPlaybackState((prev) => (prev === "warning" ? prev : "paused"));
      return;
    }

    if (autopilotRunning && !manualOverride) {
      const currentTimelineItem = timelineItems[liveIndex] ?? null;
      playResolvedSong(currentTimelineItem).catch(() => undefined);
    }
  }, [autopilotRunning, liveIndex, manualOverride, speechSpeaking, timelineItems]);

  useEffect(() => {
    if (manualOverride) {
      if (soundRef.current) {
        soundRef.current.pauseAsync().catch(() => undefined);
      }
      setPlaybackState((prev) => (prev === "warning" ? prev : "paused"));
      return;
    }

    if (!autopilotRunning) {
      if (soundRef.current) {
        soundRef.current.pauseAsync().catch(() => undefined);
      }
      if (currentTrackName) {
        setPlaybackState((prev) => (prev === "warning" ? prev : "paused"));
      }
      return;
    }

    const currentTimelineItem = timelineItems[liveIndex] ?? null;
    playResolvedSong(currentTimelineItem).catch(() => undefined);
  }, [autopilotRunning, currentTrackName, liveIndex, manualOverride, speechSpeaking, timelineItems]);

  useEffect(() => {
    if (!autopilotRunning || manualOverride || speechSpeaking) {
      return;
    }
    const currentTimelineItem = timelineItems[liveIndex] ?? null;
    playResolvedSong(currentTimelineItem).catch(() => undefined);
  }, [autopilotRunning, liveIndex, manualOverride, playlists, songs, speechSpeaking, timelineItems]);

  useEffect(() => {
    if (soundRef.current || playbackState !== "playing" || playbackDurationMillis <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setPlaybackPositionMillis((prev) => Math.min(prev + 1000, playbackDurationMillis));
    }, 1000);

    return () => clearInterval(interval);
  }, [playbackDurationMillis, playbackState, currentTrackName]);

  const value = useMemo<AppStateValue>(() => {
    const nextAnnouncement = findAnnouncementForIndex(liveIndex + 1);
    const derivedAnnouncementState =
      announcementState === "idle" && nextAnnouncement ? "pending" : announcementState;

    return {
      currentEvent,
      selectedEventId,
      savedEvents,
      timelineItems,
      songs,
      playlists,
      announcements,
      persistenceMessage,
      isHydrating,
      isOnline,
      selectedOutputLabel,
      liveIndex,
      autopilotRunning,
      manualOverride,
      countdownSeconds,
      activeAnnouncementTitle,
      announcementState: derivedAnnouncementState,
      currentAnnouncementText,
      nextAnnouncementTitle: nextAnnouncement?.title ?? null,
      nextAnnouncementText: nextAnnouncement?.previewText ?? null,
      currentTrackName,
      playbackState,
      playbackPositionMillis,
      playbackDurationMillis,
      audioWarning,
      currentTrackFallback,
      availableVoiceNames,
      selectedVoiceName,
      speechRate,
      speechSupported: canUseSpeechSynthesis,
      speechSpeaking,
      speechMessage,
      feedbackEntries,
      validationEntries,
      beginNewEventDraft: () => {
        setSelectedEventId(null);
        setSelectedOutputLabelState(null);
        setPersistenceMessage(null);
        setCurrentEvent({ ...draftEvent });
        setTimelineItems([]);
        setSongs([]);
        setPlaylists([]);
        setAnnouncements([]);
        resetLiveRuntime();
        unloadCurrentSound().catch(() => undefined);
      },
      startDemoEvent: () => {
        const demoSnapshot = cloneSnapshot(demoEventRecord);
        setSelectedEventId(demoEventRecord.id);
        setSavedEvents((prev) => {
          const remaining = prev.filter((item) => item.id !== demoEventRecord.id);
          return [{ ...demoEventRecord, updatedAt: new Date().toISOString() }, ...remaining];
        });
        setSelectedOutputLabelState("Bluetooth Speaker");
        setPersistenceMessage(null);
        skipNextSavedSyncRef.current = true;
        setCurrentEvent(demoSnapshot.event);
        setTimelineItems(demoSnapshot.timelineItems);
        setSongs(demoSnapshot.songs);
        setPlaylists(demoSnapshot.playlists);
        setAnnouncements(demoSnapshot.announcements);
        resetLiveRuntime();
        unloadCurrentSound().catch(() => undefined);
      },
      selectSavedEvent: (id) => {
        const selected = savedEvents.find((item) => item.id === id) ?? null;
        setSelectedEventId(selected?.id ?? null);
        applySnapshot(selected);
        unloadCurrentSound().catch(() => undefined);
      },
      saveCurrentEventSnapshot: (eventOverrides) => {
        const nextEvent = { ...currentEvent, ...eventOverrides };
        const recordId = selectedEventId ?? createId("event");
        setCurrentEvent(nextEvent);
        setSelectedEventId(recordId);
        setPersistenceMessage(null);
        upsertSavedEvent(recordId, nextEvent);
        return recordId;
      },
      updateEvent: (payload) => {
        setCurrentEvent((prev) => ({ ...prev, ...payload }));
      },
      setSelectedOutputLabel: (label) => {
        setSelectedOutputLabelState(label);
      },
      addTimelineItem: (payload) => {
        setTimelineItems((prev) => [
          ...prev,
          {
            id: createId("timeline"),
            title: payload?.title?.trim() || `New Moment ${prev.length + 1}`,
            time: payload?.time?.trim() || "",
            music: payload?.music?.trim() || songs[0]?.title || songs[0]?.songName || playlists[0]?.name || "",
            announcementAttached: payload?.announcementAttached ?? false,
          },
        ]);
      },
      updateTimelineItem: (id, payload) => {
        setTimelineItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)));
      },
      deleteTimelineItem: (id) => {
        setTimelineItems((prev) => prev.filter((item) => item.id !== id));
        setLiveIndex((prev) => Math.max(0, prev - 1));
      },
      reorderTimelineItems: () => {
        setTimelineItems((prev) =>
          [...prev].sort((a, b) => parseTimeValue(a.time) - parseTimeValue(b.time)),
        );
      },
      addSong: (payload) => {
        const durationMillis = payload?.durationMillis;
        setSongs((prev) => [
          ...prev,
          {
            id: createId("song"),
            title: payload?.title?.trim() || payload?.songName?.trim() || `Uploaded Track ${prev.length + 1}`,
            songName: payload?.title?.trim() || payload?.songName?.trim() || `Uploaded Track ${prev.length + 1}`,
            artist: payload?.artist?.trim() || "",
            duration: payload?.duration?.trim() || formatDurationFromMillis(durationMillis) || "3:30",
            fileType: payload?.fileType?.trim() || "MP3",
            uri: payload?.uri,
            durationMillis,
          },
        ]);
      },
      importLocalSong: async (file) => {
        if (!canUseNativeAudio) {
          const extension =
            file.name.split(".").pop()?.toUpperCase() ??
            file.mimeType?.split("/").pop()?.toUpperCase() ??
            "FILE";

          setSongs((prev) => [
            ...prev,
            {
              id: createId("song"),
              title: file.name.replace(/\.[^/.]+$/, ""),
              songName: file.name.replace(/\.[^/.]+$/, ""),
              artist: "",
              duration: "0:00",
              fileType: extension,
              uri: file.uri,
            },
          ]);
          setAudioWarning(null);
          setPersistenceMessage(
            "Song metadata is saved locally for MVP. If a file path becomes unavailable later, CrowdKue will ask you to re-upload it.",
          );
          return;
        }
        const metadataSound = new Audio.Sound();
        try {
          await metadataSound.loadAsync({ uri: file.uri }, {}, false);
          const status = await metadataSound.getStatusAsync();
          const durationMillis = status.isLoaded ? status.durationMillis ?? 0 : 0;
          const extension =
            file.name.split(".").pop()?.toUpperCase() ??
            file.mimeType?.split("/").pop()?.toUpperCase() ??
            "FILE";

          setSongs((prev) => [
            ...prev,
            {
              id: createId("song"),
              title: file.name.replace(/\.[^/.]+$/, ""),
              songName: file.name.replace(/\.[^/.]+$/, ""),
              artist: "",
              duration: formatDurationFromMillis(durationMillis),
              fileType: extension,
              uri: file.uri,
              durationMillis,
            },
          ]);
          setAudioWarning(null);
          setPersistenceMessage(
            "Song metadata is saved locally for MVP. If a file path becomes unavailable later, CrowdKue will ask you to re-upload it.",
          );
        } catch {
          setAudioWarning("CrowdKue could not read the selected local audio file.");
        } finally {
          await metadataSound.unloadAsync().catch(() => undefined);
        }
      },
      deleteSong: (id) => {
        setSongs((prev) => prev.filter((song) => song.id !== id));
        setPlaylists((prev) =>
          prev.map((playlist) => ({
            ...playlist,
            songIds: playlist.songIds.filter((songId) => songId !== id),
            detail: createPlaylistDetail(playlist.songIds.filter((songId) => songId !== id).length),
          })),
        );
      },
      reorderSongs: () => {
        setSongs((prev) => (prev.length > 1 ? [prev[1], prev[0], ...prev.slice(2)] : prev));
      },
      createPlaylist: (name) => {
        setPlaylists((prev) => [
          ...prev,
          {
            id: createId("playlist"),
            name: name?.trim() || `Playlist ${prev.length + 1}`,
            detail: createPlaylistDetail(0),
            songIds: [],
          },
        ]);
      },
      assignSongsToPlaylist: () => {
        setPlaylists((prev) =>
          prev.map((playlist, index) =>
            index === 0
              ? {
                  ...playlist,
                  songIds: songs.map((song) => song.id),
                  detail: createPlaylistDetail(songs.length),
                }
              : playlist,
          ),
        );
      },
      addSongToPlaylist: (playlistId, payload) => {
        const title = payload.title.trim();
        if (!title) {
          return;
        }

        const nextSongId = createId("song");
        const nextSong: Song = {
          id: nextSongId,
          title,
          songName: title,
          artist: payload.artist?.trim() || "",
          duration: payload.duration?.trim() || "0:00",
          fileType: "LOCAL",
        };

        setSongs((prev) => [...prev, nextSong]);
        setPlaylists((prev) =>
          prev.map((playlist) => {
            if (playlist.id !== playlistId) {
              return playlist;
            }
            const nextSongIds = [...playlist.songIds, nextSongId];
            return {
              ...playlist,
              songIds: nextSongIds,
              detail: createPlaylistDetail(nextSongIds.length),
            };
          }),
        );
        setPersistenceMessage(null);
      },
      deleteSongFromPlaylist: (playlistId, songId) => {
        setPlaylists((prev) =>
          prev.map((playlist) => {
            if (playlist.id !== playlistId) {
              return playlist;
            }
            const currentIndex = playlist.songIds.indexOf(songId);
            if (currentIndex < 0) {
              return playlist;
            }
            const nextSongIds = playlist.songIds.filter((_, index) => index !== currentIndex);
            return {
              ...playlist,
              songIds: nextSongIds,
              detail: createPlaylistDetail(nextSongIds.length),
            };
          }),
        );
      },
      moveSongInPlaylist: (playlistId, songId, direction) => {
        setPlaylists((prev) =>
          prev.map((playlist) => {
            if (playlist.id !== playlistId) {
              return playlist;
            }
            const currentIndex = playlist.songIds.indexOf(songId);
            if (currentIndex < 0) {
              return playlist;
            }
            const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
            if (nextIndex < 0 || nextIndex >= playlist.songIds.length) {
              return playlist;
            }
            const nextSongIds = [...playlist.songIds];
            [nextSongIds[currentIndex], nextSongIds[nextIndex]] = [nextSongIds[nextIndex], nextSongIds[currentIndex]];
            return {
              ...playlist,
              songIds: nextSongIds,
              detail: createPlaylistDetail(nextSongIds.length),
            };
          }),
        );
      },
      addAnnouncement: (draft) => {
        if (!draft.title.trim() || !draft.messageText.trim()) {
          return;
        }
        const assignedMoment = draft.timelineMoment || "No assignment";
        setAnnouncements((prev) => [
          ...prev,
          {
            id: createId("announcement"),
            title: draft.title.trim(),
            timelineMoment: assignedMoment,
            previewText: draft.messageText.trim(),
          },
        ]);
        setTimelineItems((prev) =>
          prev.map((item) =>
            item.title === assignedMoment ? { ...item, announcementAttached: true } : item,
          ),
        );
      },
      updateAnnouncement: (id, draft) => {
        if (!draft.title.trim() || !draft.messageText.trim()) {
          return;
        }
        setAnnouncements((prev) => {
          const nextAnnouncements = prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title: draft.title.trim(),
                  timelineMoment: draft.timelineMoment || "No assignment",
                  previewText: draft.messageText.trim(),
                }
              : item,
          );
          setTimelineItems((timelinePrev) =>
            timelinePrev.map((timelineItem) => ({
              ...timelineItem,
              announcementAttached: nextAnnouncements.some(
                (item) => item.timelineMoment === timelineItem.title,
              ),
            })),
          );
          return nextAnnouncements;
        });
      },
      deleteAnnouncement: (id) => {
        setAnnouncements((prev) => {
          const nextAnnouncements = prev.filter((item) => item.id !== id);
          setTimelineItems((timelinePrev) =>
            timelinePrev.map((timelineItem) => ({
              ...timelineItem,
              announcementAttached: nextAnnouncements.some(
                (item) => item.timelineMoment === timelineItem.title,
              ),
            })),
          );
          return nextAnnouncements;
        });
      },
      startAutopilot: () => {
        if (timelineItems.length === 0) {
          return;
        }
        setManualOverride(false);
        setAutopilotRunning(true);
        setCountdownSeconds(AUTOPILOT_COUNTDOWN_SECONDS);
        triggerAnnouncementForIndex(liveIndex);
      },
      pauseAutopilot: () => {
        setAutopilotRunning(false);
      },
      resumeAutopilot: () => {
        if (timelineItems.length === 0) {
          return;
        }
        setManualOverride(false);
        setAutopilotRunning(true);
      },
      skipToNextTimelineItem: () => {
        setLiveIndex((prev) =>
          timelineItems.length === 0 ? 0 : Math.min(prev + 1, timelineItems.length - 1),
        );
        setCountdownSeconds(AUTOPILOT_COUNTDOWN_SECONDS);
      },
      goToPreviousTimelineItem: () => {
        setLiveIndex((prev) => Math.max(prev - 1, 0));
        setCountdownSeconds(AUTOPILOT_COUNTDOWN_SECONDS);
      },
      restartCurrentTimelineItem: () => {
        setCountdownSeconds(AUTOPILOT_COUNTDOWN_SECONDS);
        setCompletedAnnouncementIds((prev) => {
          const matchingAnnouncement = findAnnouncementForIndex(liveIndex);
          if (!matchingAnnouncement) {
            return prev;
          }
          return prev.filter((id) => id !== matchingAnnouncement.id);
        });
        if (!manualOverride) {
          playResolvedSong(timelineItems[liveIndex] ?? null).catch(() => undefined);
        }
      },
      toggleManualOverride: () => {
        setManualOverride((prev) => {
          const next = !prev;
          if (next) {
            setAutopilotRunning(false);
          }
          return next;
        });
      },
      triggerManualAnnouncement: () => {
        const matchingAnnouncement = findAnnouncementForIndex(liveIndex);
        if (!matchingAnnouncement) {
          setActiveAnnouncementTitle("Manual Announcement Triggered");
          setCurrentAnnouncementText("No linked announcement was found for this timeline item.");
          setAnnouncementState("active");
          return;
        }
        setCompletedAnnouncementIds((prev) => prev.filter((id) => id !== matchingAnnouncement.id));
        setActiveAnnouncementTitle(matchingAnnouncement.title);
        setCurrentAnnouncementText(matchingAnnouncement.previewText);
        setAnnouncementState("active");
        speakAnnouncementInternal({
          title: matchingAnnouncement.title,
          text: matchingAnnouncement.previewText,
          markCompleted: true,
        });
      },
      dismissAnnouncement: () => {
        dismissCurrentAnnouncement();
      },
      speakAnnouncement: ({ title, text }) => {
        speakAnnouncementInternal({ title, text, markCompleted: false });
      },
      stopAnnouncementSpeech: () => {
        stopAnnouncementSpeechInternal();
      },
      setSelectedVoiceName: (voiceName) => {
        setSelectedVoiceNameState(voiceName);
      },
      setSpeechRate: (rate) => {
        setSpeechRateState(Math.max(0.7, Math.min(rate, 1.3)));
      },
      resetLiveProgress: () => {
        resetLiveRuntime();
        unloadCurrentSound().catch(() => undefined);
      },
      submitFeedback: ({ name, email, message }) => {
        if (!message.trim()) {
          return;
        }
        setFeedbackEntries((prev) => [
          {
            id: createId("feedback"),
            name: name?.trim() ?? "",
            email: email?.trim() ?? "",
            message: message.trim(),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      },
      submitValidationResponse: ({ response, comment }) => {
        setValidationEntries((prev) => [
          {
            id: createId("validation"),
            eventId: selectedEventId,
            response,
            comment: comment?.trim() ?? "",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      },
    };
  }, [
    activeAnnouncementTitle,
    announcementState,
    announcements,
    availableVoiceNames,
    audioWarning,
    autopilotRunning,
    countdownSeconds,
    currentAnnouncementText,
    currentEvent,
    currentTrackFallback,
    currentTrackName,
    feedbackEntries,
    isOnline,
    isHydrating,
    liveIndex,
    manualOverride,
    persistenceMessage,
    playbackDurationMillis,
    playbackPositionMillis,
    playbackState,
    playlists,
    savedEvents,
    selectedVoiceName,
    selectedOutputLabel,
    selectedEventId,
    songs,
    speechMessage,
    speechRate,
    speechSpeaking,
    timelineItems,
    validationEntries,
  ]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
