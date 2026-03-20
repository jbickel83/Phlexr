import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ActionChip } from "./ActionChip";
import { TextFieldInput } from "./TextFieldInput";
import { colors, radii, spacing } from "../constants/theme";

type PlaylistSongRow = {
  id: string;
  title: string;
  artist?: string;
  duration: string;
};

type PlaylistCardProps = {
  id: string;
  name: string;
  detail: string;
  songs: PlaylistSongRow[];
  deckAssignments: {
    trackA: string | null;
    trackB: string | null;
  };
  onAddSong: (playlistId: string, payload: { title: string; artist?: string; duration?: string }) => void;
  onDeleteSong: (playlistId: string, songId: string) => void;
  onMoveSong: (playlistId: string, songId: string, direction: "up" | "down") => void;
  onAssignTrackA: (songId: string) => void;
  onAssignTrackB: (songId: string) => void;
};

export function PlaylistCard({
  id,
  name,
  detail,
  songs,
  deckAssignments,
  onAddSong,
  onDeleteSong,
  onMoveSong,
  onAssignTrackA,
  onAssignTrackB,
}: PlaylistCardProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const resetComposer = () => {
    setSongTitle("");
    setArtist("");
    setDuration("");
    setValidationMessage(null);
    setComposerOpen(false);
  };

  const handleAddSong = () => {
    if (!songTitle.trim()) {
      setValidationMessage("Enter a song title before saving.");
      return;
    }

    setValidationMessage(null);
    onAddSong(id, {
      title: songTitle,
      artist,
      duration,
    });
    resetComposer();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{songs.length} songs</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <ActionChip label={composerOpen ? "Close add song" : "Add song"} active={composerOpen} onPress={() => setComposerOpen((prev) => !prev)} />
      </View>

      {composerOpen ? (
        <View style={styles.composer}>
          <TextFieldInput label="Song title" value={songTitle} onChangeText={setSongTitle} placeholder="Uptown Funk" />
          <TextFieldInput label="Artist" value={artist} onChangeText={setArtist} placeholder="Bruno Mars" />
          <TextFieldInput label="Duration (optional)" value={duration} onChangeText={setDuration} placeholder="4:31" />
          {validationMessage ? <Text style={styles.validationText}>{validationMessage}</Text> : null}
          <View style={styles.actions}>
            <ActionChip label="Save song" onPress={handleAddSong} />
            <ActionChip label="Cancel" onPress={resetComposer} />
          </View>
        </View>
      ) : null}

      <View style={styles.songList}>
        {songs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No songs in this playlist yet</Text>
            <Text style={styles.emptyBody}>Add the first song to make this playlist ready for your event flow.</Text>
          </View>
        ) : (
          songs.map((song, index) => (
            <View key={`${id}-${song.id}`} style={styles.songRow}>
              <View style={styles.songCopy}>
                <Text style={styles.songName}>{song.title}</Text>
                <Text style={styles.songMeta}>
                  {song.artist?.trim() ? `${song.artist} • ` : ""}
                  {song.duration || "0:00"}
                </Text>
              </View>
              <View style={styles.songActions}>
                <ActionChip label="Up" onPress={() => onMoveSong(id, song.id, "up")} />
                <ActionChip label="Down" onPress={() => onMoveSong(id, song.id, "down")} />
                <ActionChip label="Track A" active={deckAssignments.trackA === song.id} onPress={() => onAssignTrackA(song.id)} />
                <ActionChip label="Track B" active={deckAssignments.trackB === song.id} onPress={() => onAssignTrackB(song.id)} />
                <ActionChip label="Delete" onPress={() => onDeleteSong(id, song.id)} />
              </View>
              {index < songs.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(13,19,36,0.92)",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.18)",
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  counterBadge: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.18)",
    backgroundColor: "rgba(7, 17, 32, 0.9)",
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  counterText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  composer: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.12)",
    backgroundColor: "rgba(8, 14, 26, 0.9)",
  },
  validationText: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  songList: {
    gap: spacing.sm,
  },
  emptyState: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(152,167,204,0.12)",
    backgroundColor: "rgba(8, 14, 26, 0.72)",
    padding: spacing.md,
    gap: 6,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  songRow: {
    gap: spacing.sm,
  },
  songCopy: {
    gap: 4,
  },
  songName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  songMeta: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  songActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(152,167,204,0.12)",
  },
});
