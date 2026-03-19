import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";

import { EmptyStateCard } from "../components/EmptyStateCard";
import { useAppState } from "../state/AppState";

type DeckId = "left" | "right";

type DeckState = {
  title: string;
  artist: string;
  durationMs: number;
  positionMs: number;
  cuePointMs: number;
  isPlaying: boolean;
  isScratching: boolean;
  wasPlayingBeforeScratch: boolean;
  bpm: number;
  volume: number;
  bass: number;
  treble: number;
};

type KnobKey = "effects" | "mid" | "treble" | "bass";

type MixerKnobValues = Record<KnobKey, number>;

type WebAudioDeckNodes = {
  input: GainNode;
  master: GainNode;
  lowShelf: BiquadFilterNode;
  mid: BiquadFilterNode;
  highShelf: BiquadFilterNode;
  delay: DelayNode;
  feedback: GainNode;
  wet: GainNode;
  oscA: OscillatorNode;
  oscB: OscillatorNode;
};

type ScratchMeta = {
  angle: number;
  positionMs: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatMillis(value: number, fallback: string) {
  if (!value || value <= 0) {
    return fallback;
  }
  const totalSeconds = Math.floor(value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getAngleFromPoint(x: number, y: number, size: number) {
  const center = size / 2;
  return (Math.atan2(y - center, x - center) * 180) / Math.PI;
}

function normalizeAngleDelta(delta: number) {
  if (delta > 180) return delta - 360;
  if (delta < -180) return delta + 360;
  return delta;
}

function isWebAudioSupported() {
  return typeof window !== "undefined" && Boolean(window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
}

function BrandMark() {
  return (
    <View style={styles.brandMark}>
      <View style={[styles.brandBar, { height: 16, backgroundColor: "#35D6FF" }]} />
      <View style={[styles.brandBar, { height: 24, backgroundColor: "#4F7BFF" }]} />
      <View style={[styles.brandBar, { height: 34, backgroundColor: "#8F38FF" }]} />
      <View style={[styles.brandBar, { height: 24, backgroundColor: "#4F7BFF" }]} />
      <View style={[styles.brandBar, { height: 16, backgroundColor: "#35D6FF" }]} />
    </View>
  );
}

function AccentMeters({ side }: { side: DeckId }) {
  const palette =
    side === "left"
      ? ["#7C3EFF", "#30D5FF", "#F2C94C", "#9B51E0", "#B044FF"]
      : ["#FF2D5C", "#31D5FF", "#74D66A", "#9B51E0", "#4D4CFF"];

  return (
    <View style={styles.accentMeters}>
      {palette.map((color, index) => (
        <View key={`${side}-${index}`} style={[styles.accentMeter, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

function TrackPanel({ side, title, artist }: { side: DeckId; title: string; artist: string }) {
  return (
    <View style={styles.trackPanel}>
      {side === "left" ? <AccentMeters side="left" /> : null}
      <View style={[styles.trackCopy, side === "right" && styles.trackCopyRight]}>
        <Text style={styles.trackTitle}>{title}</Text>
        <Text style={styles.trackArtist}>{artist}</Text>
      </View>
      {side === "right" ? <AccentMeters side="right" /> : null}
    </View>
  );
}

function MixerButton({
  label,
  onPress,
  tone = "dark",
  icon,
}: {
  label?: string;
  onPress: () => void;
  tone?: "dark" | "blue" | "white" | "purple" | "red";
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const toneStyle =
    tone === "blue"
      ? styles.buttonBlue
      : tone === "white"
        ? styles.buttonWhite
        : tone === "purple"
          ? styles.buttonPurple
          : tone === "red"
            ? styles.buttonRed
            : styles.buttonDark;

  const glowStyle =
    tone === "blue"
      ? styles.buttonGlowBlue
      : tone === "white"
        ? styles.buttonGlowWhite
        : tone === "purple"
          ? styles.buttonGlowPurple
          : tone === "red"
            ? styles.buttonGlowRed
            : styles.buttonGlowDark;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.mixerButton, toneStyle, pressed && styles.pressed]}>
      {icon ? (
        <Ionicons name={icon} size={18} color={tone === "white" ? "#161726" : "#F8F7FF"} />
      ) : (
        <Text style={[styles.mixerButtonLabel, tone === "white" && styles.mixerButtonLabelDark]}>{label}</Text>
      )}
      <View style={[styles.mixerButtonGlow, glowStyle]} />
    </Pressable>
  );
}

function MixerKnob({
  label,
  value,
  onPress,
  centerIcon,
}: {
  label: string;
  value: number;
  onPress: () => void;
  centerIcon?: boolean;
}) {
  const rotation = `${-130 + value * 26}deg`;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.knobBlock, pressed && styles.pressed]}>
      <Text style={styles.knobTick}>⌃</Text>
      <View style={styles.knobOuter}>
        <View style={[styles.knobInner, { transform: [{ rotate: rotation }] }]}>
          <View style={styles.knobNeedle} />
        </View>
      </View>
      {centerIcon ? (
        <MaterialCommunityIcons name="tune-vertical" size={18} color="#F2F1FF" />
      ) : (
        <Text style={styles.knobLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

function InteractiveMixerKnob({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}) {
  const dragRef = useRef({ startY: 0, startValue: value });
  const rotation = `${-135 + value * 270}deg`;

  return (
    <View
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => {
        dragRef.current = {
          startY: event.nativeEvent.pageY,
          startValue: value,
        };
      }}
      onResponderMove={(event) => {
        const delta = (dragRef.current.startY - event.nativeEvent.pageY) / 140;
        onValueChange(clamp(dragRef.current.startValue + delta, 0, 1));
      }}
      style={styles.knobBlock}
    >
      <Text style={styles.knobTick}>⌃</Text>
      <View style={styles.knobOuter}>
        <View style={[styles.knobInner, { transform: [{ rotate: rotation }] }]}>
          <View style={styles.knobNeedle} />
        </View>
      </View>
      <Text style={styles.knobLabel}>{label}</Text>
    </View>
  );
}

function BottomNavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
      <View style={[styles.navIconWrap, active && styles.navIconWrapActive]}>
        <Ionicons name={icon} size={20} color={active ? "#722BFF" : "#9E9AC5"} />
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function Turntable({
  side,
  title,
  artist,
  ringColor,
  centerColor,
  rotation,
  playbackScale,
  onScratchStart,
  onScratchMove,
  onScratchEnd,
}: {
  side: DeckId;
  title: string;
  artist: string;
  ringColor: string;
  centerColor: string;
  rotation: number;
  playbackScale: number;
  onScratchStart: (event: GestureResponderEvent) => void;
  onScratchMove: (event: GestureResponderEvent) => void;
  onScratchEnd: () => void;
}) {
  return (
    <View style={styles.turntableWrap}>
      <View style={styles.turntableHeader}>
        {side === "left" ? <AccentMeters side="left" /> : null}
        <View style={[styles.trackCopy, side === "right" && styles.trackCopyRight]}>
          <Text style={styles.trackTitle}>{title}</Text>
          <Text style={styles.trackArtist}>{artist}</Text>
        </View>
        {side === "right" ? <AccentMeters side="right" /> : null}
      </View>

      <View style={styles.platterZone}>
        <View style={[styles.deckUtility, side === "right" && styles.deckUtilityRight]}>
          <View style={styles.deckUtilityStack}>
            <View style={styles.deckUtilityLine} />
            <View style={[styles.deckUtilityLine, styles.deckUtilityMedium]} />
            <View style={[styles.deckUtilityLine, styles.deckUtilityShort]} />
          </View>
        </View>

        <View style={[styles.platterGlow, { shadowColor: ringColor, opacity: 0.72 + playbackScale * 0.28 }]}>
          <View
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={onScratchStart}
            onResponderMove={onScratchMove}
            onResponderRelease={onScratchEnd}
            onResponderTerminate={onScratchEnd}
            style={[styles.platterRing, { borderColor: `${ringColor}CC` }]}
          >
            <View style={[styles.platterInnerRing, { transform: [{ rotate: `${rotation}deg` }] }]}>
              <View style={styles.vinylFace}>
                <View style={styles.vinylGrooveLarge} />
                <View style={styles.vinylGrooveSmall} />
                <View style={[styles.rotationMarker, { backgroundColor: ringColor }]} />
                <View
                  style={[
                    styles.accentSweep,
                    side === "left" ? styles.accentSweepLeft : styles.accentSweepRight,
                    { backgroundColor: ringColor },
                  ]}
                />
                <View style={[styles.vinylCenter, { backgroundColor: centerColor }]}>
                  <View style={styles.vinylCenterDot} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.deckPitchRail, side === "right" && styles.deckPitchRailRight]}>
          <View style={styles.pitchLineLong} />
          <View style={styles.pitchLineShort} />
          <View style={styles.pitchDot} />
        </View>
      </View>
    </View>
  );
}

export function DJMixingBoardScreen() {
  const navigation = useNavigation<any>();
  const { timelineItems } = useAppState();

  const waveformHeights = useMemo(
    () => [8, 12, 16, 18, 20, 22, 24, 26, 24, 20, 18, 16, 14, 18, 22, 24, 26, 24, 20, 16, 12, 10, 12, 15, 18, 20, 18, 16, 12, 10],
    [],
  );

  const [leftDeck, setLeftDeck] = useState<DeckState>({
    title: "Fly Me to the Moon",
    artist: "Frank Sinatra",
    durationMs: 225000,
    positionMs: 83000,
    cuePointMs: 0,
    isPlaying: true,
    isScratching: false,
    wasPlayingBeforeScratch: false,
    bpm: 95,
    volume: 0.88,
    bass: 6,
    treble: 7,
  });
  const [rightDeck, setRightDeck] = useState<DeckState>({
    title: "Uptown Funk",
    artist: "Bruno Mars",
    durationMs: 225000,
    positionMs: 45000,
    cuePointMs: 0,
    isPlaying: false,
    isScratching: false,
    wasPlayingBeforeScratch: false,
    bpm: 120,
    volume: 0.72,
    bass: 5,
    treble: 6,
  });
  const [crossfader, setCrossfader] = useState(0.5);
  const [knobValues, setKnobValues] = useState<MixerKnobValues>({
    effects: 0.55,
    mid: 0.52,
    treble: 0.64,
    bass: 0.58,
  });
  const [leftSlider, setLeftSlider] = useState(0.2);
  const [rightSlider, setRightSlider] = useState(0.35);
  const [crossTrackWidth, setCrossTrackWidth] = useState(0);
  const [leftSliderHeight, setLeftSliderHeight] = useState(0);
  const [rightSliderHeight, setRightSliderHeight] = useState(0);
  const [leftPlatterSize, setLeftPlatterSize] = useState(0);
  const [rightPlatterSize, setRightPlatterSize] = useState(0);

  const lastTickRef = useRef(Date.now());
  const audioContextRef = useRef<AudioContext | null>(null);
  const deckAudioNodesRef = useRef<Record<DeckId, WebAudioDeckNodes | null>>({
    left: null,
    right: null,
  });
  const scratchRef = useRef<Record<DeckId, ScratchMeta>>({
    left: { angle: 0, positionMs: 0 },
    right: { angle: 0, positionMs: 0 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      lastTickRef.current = now;

      setLeftDeck((prev) => {
        if (!prev.isPlaying || prev.isScratching) return prev;
        return { ...prev, positionMs: clamp(prev.positionMs + deltaMs, 0, prev.durationMs) };
      });

      setRightDeck((prev) => {
        if (!prev.isPlaying || prev.isScratching) return prev;
        return { ...prev, positionMs: clamp(prev.positionMs + deltaMs, 0, prev.durationMs) };
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const ensureAudioGraph = () => {
    if (!isWebAudioSupported()) {
      return null;
    }

    if (!audioContextRef.current) {
      const WebAudioContext =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!WebAudioContext) {
        return null;
      }

      const context = new WebAudioContext();
      const createDeckNodes = (primaryFrequency: number, secondaryFrequency: number): WebAudioDeckNodes => {
        const input = context.createGain();
        const lowShelf = context.createBiquadFilter();
        lowShelf.type = "lowshelf";
        lowShelf.frequency.value = 180;

        const mid = context.createBiquadFilter();
        mid.type = "peaking";
        mid.frequency.value = 1100;
        mid.Q.value = 1.2;

        const highShelf = context.createBiquadFilter();
        highShelf.type = "highshelf";
        highShelf.frequency.value = 3600;

        const delay = context.createDelay(0.5);
        const feedback = context.createGain();
        const wet = context.createGain();
        const master = context.createGain();

        const oscA = context.createOscillator();
        oscA.type = "sawtooth";
        oscA.frequency.value = primaryFrequency;

        const oscB = context.createOscillator();
        oscB.type = "triangle";
        oscB.frequency.value = secondaryFrequency;

        const oscBGain = context.createGain();
        oscBGain.gain.value = 0.42;

        oscA.connect(input);
        oscB.connect(oscBGain);
        oscBGain.connect(input);
        input.connect(lowShelf);
        lowShelf.connect(mid);
        mid.connect(highShelf);
        highShelf.connect(master);
        highShelf.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        wet.connect(master);
        master.connect(context.destination);

        oscA.start();
        oscB.start();

        return { input, lowShelf, mid, highShelf, delay, feedback, wet, master, oscA, oscB };
      };

      audioContextRef.current = context;
      deckAudioNodesRef.current = {
        left: createDeckNodes(196, 392),
        right: createDeckNodes(294, 147),
      };
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => undefined);
    }

    return deckAudioNodesRef.current;
  };

  useEffect(() => {
    const deckNodes = ensureAudioGraph();
    if (!deckNodes || !audioContextRef.current) {
      return;
    }

    const applyDeckMix = (deck: DeckId, deckState: DeckState, mixLevel: number) => {
      const nodes = deckNodes[deck];
      if (!nodes) {
        return;
      }

      const playingLevel = deckState.isPlaying || deckState.isScratching ? 1 : 0;
      nodes.master.gain.value = mixLevel * playingLevel;
      nodes.lowShelf.gain.value = -14 + knobValues.bass * 28;
      nodes.mid.gain.value = -12 + knobValues.mid * 24;
      nodes.highShelf.gain.value = -14 + knobValues.treble * 28;
      nodes.delay.delayTime.value = 0.04 + knobValues.effects * 0.26;
      nodes.feedback.gain.value = 0.08 + knobValues.effects * 0.46;
      nodes.wet.gain.value = knobValues.effects * 0.42;

      const detuneBase = deckState.isScratching ? (deckState.positionMs % 2000) - 1000 : 0;
      nodes.oscA.detune.value = detuneBase * 0.45;
      nodes.oscB.detune.value = -detuneBase * 0.3;
    };

    applyDeckMix("left", leftDeck, leftDeck.volume * (1 - crossfader));
    applyDeckMix("right", rightDeck, rightDeck.volume * crossfader);
  }, [crossfader, knobValues, leftDeck, rightDeck]);

  useEffect(
    () => () => {
      if (!audioContextRef.current) {
        return;
      }
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
      deckAudioNodesRef.current = { left: null, right: null };
    },
    [],
  );

  const handleScratchStart = (deck: DeckId, event: GestureResponderEvent) => {
    ensureAudioGraph();
    const size = deck === "left" ? leftPlatterSize : rightPlatterSize;
    if (!size) return;
    const angle = getAngleFromPoint(event.nativeEvent.locationX, event.nativeEvent.locationY, size);
    const deckState = deck === "left" ? leftDeck : rightDeck;

    scratchRef.current[deck] = { angle, positionMs: deckState.positionMs };

    const setter = deck === "left" ? setLeftDeck : setRightDeck;
    setter((prev) => ({
      ...prev,
      isScratching: true,
      wasPlayingBeforeScratch: prev.isPlaying,
      isPlaying: false,
    }));
  };

  const handleScratchMove = (deck: DeckId, event: GestureResponderEvent) => {
    const size = deck === "left" ? leftPlatterSize : rightPlatterSize;
    if (!size) return;
    const angle = getAngleFromPoint(event.nativeEvent.locationX, event.nativeEvent.locationY, size);
    const previous = scratchRef.current[deck];
    const deltaAngle = normalizeAngleDelta(angle - previous.angle);
    const durationMs = deck === "left" ? leftDeck.durationMs : rightDeck.durationMs;
    const nextPosition = clamp(previous.positionMs + deltaAngle * 32, 0, durationMs);

    scratchRef.current[deck] = { angle, positionMs: nextPosition };

    const setter = deck === "left" ? setLeftDeck : setRightDeck;
    setter((prev) => ({ ...prev, positionMs: nextPosition }));
  };

  const handleScratchEnd = (deck: DeckId) => {
    const setter = deck === "left" ? setLeftDeck : setRightDeck;
    setter((prev) => ({
      ...prev,
      isScratching: false,
      isPlaying: prev.wasPlayingBeforeScratch,
      wasPlayingBeforeScratch: false,
    }));
  };

  const handleCue = (deck: DeckId) => {
    ensureAudioGraph();
    const setter = deck === "left" ? setLeftDeck : setRightDeck;
    setter((prev) => ({
      ...prev,
      positionMs: prev.cuePointMs,
      isPlaying: false,
    }));
  };

  const handleSyncDeck = (deck: DeckId) => {
    ensureAudioGraph();
    if (deck === "left") {
      setLeftDeck((prev) => ({
        ...prev,
        bpm: rightDeck.bpm,
        positionMs: (rightDeck.positionMs / Math.max(rightDeck.durationMs, 1)) * prev.durationMs,
        isPlaying: rightDeck.isPlaying,
      }));
      return;
    }

    setRightDeck((prev) => ({
      ...prev,
      bpm: leftDeck.bpm,
      positionMs: (leftDeck.positionMs / Math.max(leftDeck.durationMs, 1)) * prev.durationMs,
      isPlaying: leftDeck.isPlaying,
    }));
  };

  const handleStop = () => {
    setLeftDeck((prev) => ({ ...prev, isPlaying: false, positionMs: prev.cuePointMs }));
    setRightDeck((prev) => ({ ...prev, isPlaying: false, positionMs: prev.cuePointMs }));
  };

  const handlePlayPause = (deck: DeckId) => {
    ensureAudioGraph();
    const setter = deck === "left" ? setLeftDeck : setRightDeck;
    setter((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleGlobalPlay = () => {
    ensureAudioGraph();
    if (leftDeck.isPlaying || rightDeck.isPlaying) {
      setLeftDeck((prev) => ({ ...prev, isPlaying: false }));
      setRightDeck((prev) => ({ ...prev, isPlaying: false }));
      return;
    }
    setLeftDeck((prev) => ({ ...prev, isPlaying: true }));
  };

  const handleSkip = () => {
    ensureAudioGraph();
    setRightDeck((prev) => ({
      ...prev,
      title: "Can’t Stop the Feeling",
      artist: "Justin Timberlake",
      positionMs: 0,
      cuePointMs: 0,
      durationMs: 236000,
      isPlaying: true,
    }));
  };

  const onCrossTrackLayout = (event: LayoutChangeEvent) => setCrossTrackWidth(event.nativeEvent.layout.width);
  const onLeftSliderLayout = (event: LayoutChangeEvent) => setLeftSliderHeight(event.nativeEvent.layout.height);
  const onRightSliderLayout = (event: LayoutChangeEvent) => setRightSliderHeight(event.nativeEvent.layout.height);

  if (timelineItems.length === 0) {
    return (
      <LinearGradient colors={["#070812", "#0D1020", "#16132A"]} style={styles.screen}>
        <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
          <EmptyStateCard title="Add your first timeline moment" description="The CrowdKue mixer appears once your event timeline is ready." />
        </ScrollView>
      </LinearGradient>
    );
  }

  const leftDeckLevel = leftDeck.volume * (1 - crossfader);
  const rightDeckLevel = rightDeck.volume * crossfader;
  const leftRotation = (leftDeck.positionMs / leftDeck.durationMs) * 1440;
  const rightRotation = (rightDeck.positionMs / rightDeck.durationMs) * 1440;
  const leftWaveActive = Math.round((leftDeck.positionMs / leftDeck.durationMs) * (waveformHeights.length / 2));
  const rightWaveActive = Math.round((rightDeck.positionMs / rightDeck.durationMs) * (waveformHeights.length / 2));

  return (
    <LinearGradient colors={["#060710", "#0C0E1B", "#121224"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        <View style={styles.panelWrap}>
          <LinearGradient
            colors={["rgba(58,42,118,0.28)", "rgba(12,14,24,0.98)", "rgba(7,9,14,1)"]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.panel}
          >
            <View style={styles.topBar}>
              <Ionicons name="arrow-back" size={26} color="#F4F3FF" />
              <View style={styles.logoRow}>
                <BrandMark />
                <Text style={styles.logoText}>CrowdKue</Text>
              </View>
              <Ionicons name="headset-outline" size={25} color="#F4F3FF" />
            </View>

            <View style={styles.trackRow}>
              <TrackPanel side="left" title={leftDeck.title} artist={leftDeck.artist} />
              <View style={styles.trackDivider} />
              <TrackPanel side="right" title={rightDeck.title} artist={rightDeck.artist} />
            </View>

            <View style={styles.waveStrip}>
              <View style={styles.waveMetaLeft}>
                <Text style={styles.waveTime}>{formatMillis(leftDeck.positionMs, "01:23")}</Text>
                <Text style={styles.waveSubMeta}>{leftDeck.bpm.toFixed(1)} BPM</Text>
              </View>

              <View style={styles.waveformWrap}>
                <View style={styles.waveCenterMarker} />
                {waveformHeights.map((height, index) => {
                  const leftHalf = index < waveformHeights.length / 2;
                  const active = leftHalf ? index < leftWaveActive : index - waveformHeights.length / 2 < rightWaveActive;
                  return (
                    <View
                      key={`wave-${index}`}
                      style={[
                        styles.waveBar,
                        {
                          height,
                          opacity: active ? 1 : 0.28,
                          backgroundColor: leftHalf ? "#34D8FF" : "#FF5F9C",
                        },
                      ]}
                    />
                  );
                })}
              </View>

              <View style={styles.waveMetaRight}>
                <Text style={styles.waveTime}>{formatMillis(rightDeck.positionMs, "00:45")}</Text>
                <Text style={styles.waveSubMeta}>{rightDeck.bpm.toFixed(1)} BPM</Text>
              </View>
            </View>

            <View style={styles.mixerStage}>
              <View onLayout={(event) => setLeftPlatterSize(event.nativeEvent.layout.width - 40)} style={styles.turntableLayout}>
                <Turntable
                  side="left"
                  title={leftDeck.title}
                  artist={leftDeck.artist}
                  ringColor="#35D6FF"
                  centerColor="#5B6AA4"
                  rotation={leftRotation}
                  playbackScale={leftDeckLevel}
                  onScratchStart={(event) => handleScratchStart("left", event)}
                  onScratchMove={(event) => handleScratchMove("left", event)}
                  onScratchEnd={() => handleScratchEnd("left")}
                />
              </View>

              <View style={styles.centerMixer}>
                <View style={styles.channelSliders}>
                  <View
                    onLayout={onLeftSliderLayout}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={(event) => {
                      if (!leftSliderHeight) return;
                      const next = clamp(event.nativeEvent.locationY / leftSliderHeight, 0, 1);
                      setLeftSlider(next);
                      setLeftDeck((prev) => ({ ...prev, volume: 1 - next }));
                    }}
                    onResponderMove={(event) => {
                      if (!leftSliderHeight) return;
                      const next = clamp(event.nativeEvent.locationY / leftSliderHeight, 0, 1);
                      setLeftSlider(next);
                      setLeftDeck((prev) => ({ ...prev, volume: 1 - next }));
                    }}
                    style={styles.channelSlider}
                  >
                    <View style={[styles.channelFill, { height: `${(1 - leftSlider) * 100}%` }]} />
                    <View style={[styles.channelThumb, { top: leftSlider * Math.max(leftSliderHeight - 16, 0) }]} />
                  </View>

                  <View
                    onLayout={onRightSliderLayout}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={(event) => {
                      if (!rightSliderHeight) return;
                      const next = clamp(event.nativeEvent.locationY / rightSliderHeight, 0, 1);
                      setRightSlider(next);
                      setRightDeck((prev) => ({ ...prev, volume: 1 - next }));
                    }}
                    onResponderMove={(event) => {
                      if (!rightSliderHeight) return;
                      const next = clamp(event.nativeEvent.locationY / rightSliderHeight, 0, 1);
                      setRightSlider(next);
                      setRightDeck((prev) => ({ ...prev, volume: 1 - next }));
                    }}
                    style={styles.channelSlider}
                  >
                    <View style={[styles.channelFill, { height: `${(1 - rightSlider) * 100}%` }]} />
                    <View style={[styles.channelThumb, { top: rightSlider * Math.max(rightSliderHeight - 16, 0) }]} />
                  </View>
                </View>

                <View style={styles.statusLightRow}>
                  <View style={styles.statusLight} />
                  <View style={styles.statusLight} />
                  <View style={styles.statusLight} />
                </View>

                <View style={styles.centerMiniFader} />
                <Text style={styles.centerBrand}>Doppler</Text>
                <View style={styles.bottomDots}>
                  <View style={styles.bottomDot} />
                  <View style={styles.bottomDot} />
                </View>
              </View>

              <View onLayout={(event) => setRightPlatterSize(event.nativeEvent.layout.width - 40)} style={styles.turntableLayout}>
                <Turntable
                  side="right"
                  title={rightDeck.title}
                  artist={rightDeck.artist}
                  ringColor="#FF5F9C"
                  centerColor="#C63A45"
                  rotation={rightRotation}
                  playbackScale={rightDeckLevel}
                  onScratchStart={(event) => handleScratchStart("right", event)}
                  onScratchMove={(event) => handleScratchMove("right", event)}
                  onScratchEnd={() => handleScratchEnd("right")}
                />
              </View>
            </View>

            <View style={styles.crossfaderRow}>
              <MixerButton label="CUE" onPress={() => handleCue("left")} tone="dark" />

              <View style={styles.crossfaderWrap}>
                <View
                  onLayout={onCrossTrackLayout}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderGrant={(event) => {
                    if (!crossTrackWidth) return;
                    setCrossfader(clamp(event.nativeEvent.locationX / crossTrackWidth, 0, 1));
                  }}
                  onResponderMove={(event) => {
                    if (!crossTrackWidth) return;
                    setCrossfader(clamp(event.nativeEvent.locationX / crossTrackWidth, 0, 1));
                  }}
                  style={styles.crossfaderTrack}
                >
                  <View style={[styles.crossfaderFill, { width: `${crossfader * 100}%` }]} />
                  {Array.from({ length: 26 }).map((_, index) => (
                    <View key={`cf-${index}`} style={styles.crossTick} />
                  ))}
                  <View style={[styles.crossThumb, { left: `${crossfader * 100}%` }]} />
                </View>
              </View>

              <MixerButton label="CUE" onPress={() => handleCue("right")} tone="dark" />
            </View>

            <View style={styles.knobRow}>
              <InteractiveMixerKnob
                label="EFFECTS"
                value={knobValues.effects}
                onValueChange={(value) => setKnobValues((prev) => ({ ...prev, effects: value }))}
              />
              <InteractiveMixerKnob
                label="MID"
                value={knobValues.mid}
                onValueChange={(value) => setKnobValues((prev) => ({ ...prev, mid: value }))}
              />
              <InteractiveMixerKnob
                label="TREBLE"
                value={knobValues.treble}
                onValueChange={(value) => setKnobValues((prev) => ({ ...prev, treble: value }))}
              />
              <InteractiveMixerKnob
                label="BASS"
                value={knobValues.bass}
                onValueChange={(value) => setKnobValues((prev) => ({ ...prev, bass: value }))}
              />
            </View>

            <View style={styles.transportRow}>
              <MixerButton label="SYNC" onPress={() => handleSyncDeck("left")} tone="blue" />
              <MixerButton label="STOP" onPress={handleStop} tone="white" />
              <MixerButton label="PLAY" onPress={handleGlobalPlay} tone="red" />
              <MixerButton label="SYNC" onPress={() => handleSyncDeck("right")} tone="blue" />
            </View>

            <View style={styles.bottomDetailBlock}>
              <View style={styles.detailLineLong} />
              <View style={styles.detailLineShort} />
              <View style={styles.detailDotRow}>
                {Array.from({ length: 18 }).map((_, index) => (
                  <View key={`detail-${index}`} style={[styles.detailDot, index < Math.round(crossfader * 18) && styles.detailDotActive]} />
                ))}
              </View>
            </View>

            <View style={styles.bottomNav}>
              <BottomNavItem icon="home" label="Dashboard" onPress={() => navigation.getParent()?.navigate("Dashboard")} />
              <BottomNavItem icon="headset" label="Mixer" active onPress={() => navigation.getParent()?.navigate("Mixer")} />
              <BottomNavItem icon="folder" label="Playlists" onPress={() => navigation.getParent()?.navigate("Music")} />
              <BottomNavItem
                icon="person"
                label="Ann."
                onPress={() => navigation.getParent()?.navigate("Events", { screen: "Announcements" })}
              />
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#080913" },
  screenContent: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 120 },
  panelWrap: { width: "100%", maxWidth: 1080, alignSelf: "center", shadowColor: "#6B48FF", shadowOpacity: 0.28, shadowRadius: 36, shadowOffset: { width: 0, height: 20 }, elevation: 18 },
  panel: { borderRadius: 30, borderWidth: 1, borderColor: "rgba(114,95,255,0.16)", overflow: "hidden" },
  topBar: { height: 72, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(10,11,20,0.88)" },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandMark: { flexDirection: "row", alignItems: "center", gap: 3 },
  brandBar: { width: 4, borderRadius: 999 },
  logoText: { color: "#F4F3FF", fontSize: 24, fontWeight: "800", letterSpacing: -0.4 },
  trackRow: { flexDirection: "row", alignItems: "stretch", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: "rgba(14,16,28,0.8)" },
  trackDivider: { width: 1, marginHorizontal: 18, backgroundColor: "rgba(255,255,255,0.08)" },
  trackPanel: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  accentMeters: { gap: 4 },
  accentMeter: { width: 16, height: 4, borderRadius: 3 },
  trackCopy: { flex: 1, gap: 4 },
  trackCopyRight: { alignItems: "flex-end" },
  trackTitle: { color: "#F3F2FF", fontSize: 18, fontWeight: "700" },
  trackArtist: { color: "#8793FF", fontSize: 13, fontWeight: "700" },
  waveStrip: { flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "rgba(7,8,14,0.95)", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  waveMetaLeft: { width: 74, alignItems: "flex-start" },
  waveMetaRight: { width: 74, alignItems: "flex-end" },
  waveTime: { color: "#F4F3FF", fontSize: 17, fontWeight: "800" },
  waveSubMeta: { color: "#8188AC", fontSize: 10, fontWeight: "700", marginTop: 2 },
  waveformWrap: { flex: 1, height: 40, flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative" },
  waveCenterMarker: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, borderRadius: 999, backgroundColor: "#7B6890", zIndex: 3 },
  waveBar: { width: 4, borderRadius: 999 },
  mixerStage: { flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 20, paddingTop: 16 },
  turntableLayout: { flex: 1 },
  turntableWrap: { flex: 1, minHeight: 320 },
  turntableHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  platterZone: { flexDirection: "row", alignItems: "center", gap: 12 },
  deckUtility: { width: 16, alignItems: "flex-start" },
  deckUtilityRight: { alignItems: "flex-end" },
  deckUtilityStack: { gap: 5 },
  deckUtilityLine: { width: 14, height: 4, borderRadius: 999, backgroundColor: "#A2A6C7" },
  deckUtilityMedium: { width: 10 },
  deckUtilityShort: { width: 7 },
  platterGlow: { flex: 1, shadowOpacity: 0.42, shadowRadius: 22, shadowOffset: { width: 0, height: 0 } },
  platterRing: { aspectRatio: 1, borderRadius: 999, borderWidth: 3, backgroundColor: "#080A12", alignItems: "center", justifyContent: "center" },
  platterInnerRing: { width: "84%", height: "84%", borderRadius: 999, borderWidth: 2, borderColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center", backgroundColor: "#090B13" },
  vinylFace: { width: "82%", height: "82%", borderRadius: 999, backgroundColor: "#05070E", borderWidth: 1, borderColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  vinylGrooveLarge: { position: "absolute", width: "82%", height: "82%", borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  vinylGrooveSmall: { position: "absolute", width: "64%", height: "64%", borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  rotationMarker: { position: "absolute", top: 16, width: 5, height: "24%", borderRadius: 999, opacity: 0.94 },
  accentSweep: { position: "absolute", width: "38%", height: 5, borderRadius: 999 },
  accentSweepLeft: { left: 10, bottom: 28, transform: [{ rotate: "68deg" }] },
  accentSweepRight: { right: 10, bottom: 28, transform: [{ rotate: "-68deg" }] },
  vinylCenter: { width: "30%", height: "30%", borderRadius: 999, alignItems: "center", justifyContent: "center" },
  vinylCenterDot: { width: 9, height: 9, borderRadius: 999, backgroundColor: "#F4F4FF" },
  deckPitchRail: { width: 14, gap: 7, alignItems: "flex-start" },
  deckPitchRailRight: { alignItems: "flex-end" },
  pitchLineLong: { width: 12, height: 3, borderRadius: 999, backgroundColor: "#3DABFF" },
  pitchLineShort: { width: 8, height: 3, borderRadius: 999, backgroundColor: "#3DABFF" },
  pitchDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#4A5B9A" },
  centerMixer: { width: 86, height: 256, borderRadius: 18, backgroundColor: "rgba(19,22,34,0.98)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", alignItems: "center", justifyContent: "space-between", paddingVertical: 18 },
  channelSliders: { flexDirection: "row", gap: 10 },
  channelSlider: { width: 12, height: 80, borderRadius: 8, backgroundColor: "#2D3144", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden", justifyContent: "flex-end" },
  channelFill: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "rgba(92,127,255,0.32)" },
  channelThumb: { position: "absolute", left: 1, right: 1, height: 16, borderRadius: 4, backgroundColor: "#BAC4FF" },
  statusLightRow: { flexDirection: "row", gap: 6 },
  statusLight: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#79DA66" },
  centerMiniFader: { width: 28, height: 4, borderRadius: 999, backgroundColor: "#A7ADC8" },
  centerBrand: { color: "#8E94B2", fontSize: 10, fontWeight: "700" },
  bottomDots: { flexDirection: "row", gap: 12 },
  bottomDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#4F598B" },
  crossfaderRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, marginTop: 18 },
  crossfaderWrap: { flex: 1, height: 54, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(18,20,31,0.98)", paddingHorizontal: 14, justifyContent: "center" },
  crossfaderTrack: { height: 14, borderRadius: 999, backgroundColor: "#0A0C12", flexDirection: "row", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" },
  crossfaderFill: { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 999, backgroundColor: "rgba(123,104,144,0.28)" },
  crossTick: { width: 1, height: 12, backgroundColor: "rgba(255,255,255,0.18)" },
  crossThumb: { position: "absolute", top: -7, marginLeft: -9, width: 18, height: 28, borderRadius: 3, backgroundColor: "#EBEAFF", borderWidth: 1, borderColor: "rgba(0,0,0,0.45)" },
  mixerButton: { flex: 1, minHeight: 58, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  buttonDark: { backgroundColor: "rgba(20,22,33,0.98)", borderColor: "rgba(255,255,255,0.09)" },
  buttonBlue: { backgroundColor: "rgba(18,23,40,0.98)", borderColor: "rgba(56,133,255,0.26)" },
  buttonWhite: { backgroundColor: "rgba(239,241,255,0.98)", borderColor: "rgba(255,255,255,0.75)" },
  buttonPurple: { backgroundColor: "rgba(113,53,202,0.98)", borderColor: "rgba(213,93,255,0.36)" },
  buttonRed: { backgroundColor: "rgba(21,22,33,0.98)", borderColor: "rgba(255,255,255,0.08)" },
  mixerButtonLabel: { color: "#F7F6FF", fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
  mixerButtonLabelDark: { color: "#151622" },
  mixerButtonGlow: { position: "absolute", left: 0, right: 0, bottom: 0, height: 5 },
  buttonGlowDark: { backgroundColor: "#6EE1D4" },
  buttonGlowBlue: { backgroundColor: "#177BFF" },
  buttonGlowWhite: { backgroundColor: "#63A5FF" },
  buttonGlowPurple: { backgroundColor: "#D55DFF" },
  buttonGlowRed: { backgroundColor: "#FF4F5A" },
  knobRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingHorizontal: 20, marginTop: 22 },
  knobBlock: { flex: 1, alignItems: "center", gap: 6 },
  knobTick: { color: "#8A8EA9", fontSize: 10, fontWeight: "800" },
  knobOuter: { width: 58, height: 58, borderRadius: 999, borderWidth: 1, borderColor: "rgba(223,228,255,0.35)", backgroundColor: "#0F1119", alignItems: "center", justifyContent: "center" },
  knobInner: { width: 36, height: 36, borderRadius: 999, backgroundColor: "#1D2232", alignItems: "center", paddingTop: 5 },
  knobNeedle: { width: 4, height: 12, borderRadius: 999, backgroundColor: "#E2E7FF" },
  knobLabel: { color: "#F1F0FF", fontSize: 11, fontWeight: "800", textTransform: "uppercase", textAlign: "center" },
  transportRow: { flexDirection: "row", gap: 14, paddingHorizontal: 20, marginTop: 18 },
  bottomDetailBlock: { paddingHorizontal: 20, marginTop: 20, gap: 10 },
  detailLineLong: { height: 2, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 999 },
  detailLineShort: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 999 },
  detailDotRow: { flexDirection: "row", justifyContent: "center", gap: 8 },
  detailDot: { width: 4, height: 4, borderRadius: 999, backgroundColor: "rgba(122,127,155,0.62)" },
  detailDotActive: { backgroundColor: "#8D79FF" },
  bottomNav: { marginTop: 22, minHeight: 76, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(10,11,18,0.96)", flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 12, paddingVertical: 10 },
  navItem: { alignItems: "center", gap: 6, flex: 1 },
  navIconWrap: { width: 34, height: 34, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  navIconWrapActive: { backgroundColor: "rgba(114,43,255,0.18)" },
  navLabel: { color: "#A4A0C9", fontSize: 12, fontWeight: "700" },
  navLabelActive: { color: "#F5F3FF" },
});
