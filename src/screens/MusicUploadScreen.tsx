import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { BackLink } from "../components/BackLink";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { GlowCard } from "../components/GlowCard";
import { NeonButton } from "../components/NeonButton";
import { PlaylistCard } from "../components/PlaylistCard";
import { SongLibraryCard } from "../components/SongLibraryCard";
import { TextFieldInput } from "../components/TextFieldInput";
import { colors, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

export function MusicUploadScreen() {
  const navigation = useNavigation<any>();
  const {
    songs,
    playlists,
    importLocalSong,
    addSong,
    deleteSong,
    reorderSongs,
    createPlaylist,
    assignSongsToPlaylist,
    assignSongToDeck,
    addSongToPlaylist,
    deleteSongFromPlaylist,
    moveSongInPlaylist,
    saveCurrentEventSnapshot,
    audioWarning,
    persistenceMessage,
    isHydrating,
  } = useAppState();
  const [playlistName, setPlaylistName] = useState("");

  const resolvePlaylistSongs = (songIds: string[]) =>
    songIds.reduce<Array<{ id: string; title: string; artist?: string; duration: string }>>((acc, songId) => {
      const song = songs.find((item) => item.id === songId);
      if (!song) {
        return acc;
      }
      acc.push({
        id: song.id,
        title: song.title || song.songName || "Track",
        artist: song.artist,
        duration: song.duration,
      });
      return acc;
    }, []);

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", style: "destructive", onPress: onConfirm },
    ]);
  };

  const handlePickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/*"],
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    const file = result.assets[0];
    await importLocalSong({
      uri: file.uri,
      name: file.name,
      mimeType: file.mimeType,
    });
  };

  return (
    <LinearGradient colors={["#04070F", "#071120", "#0A1730"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackLink label="Back to Event Overview" onPress={() => navigation.navigate("Events", { screen: "EventOverview" })} />
          <Text style={styles.eyebrow}>Music / Playlist Upload</Text>
          <Text style={styles.title}>Manage the event music library.</Text>
          <Text style={styles.subtitle}>
            Organize uploaded songs, build playlists, and prep the music CrowdKue will run during the event.
          </Text>
        </View>

        <GlowCard style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Upload audio files</Text>
          <Text style={styles.sectionBody}>
            Music must be uploaded or stored locally on the device. Streaming playback is not supported for event control.
          </Text>
          <Text style={styles.noteText}>
            Local song metadata is saved on this device for MVP. If a stored file path becomes unavailable later, simply re-upload that track.
          </Text>
          <View style={styles.buttonStack}>
            <NeonButton label="Pick local audio file" variant="secondary" onPress={handlePickAudio} />
            <NeonButton label="Add empty song entry" variant="secondary" onPress={() => addSong()} />
          </View>
          {audioWarning ? <Text style={styles.warning}>{audioWarning}</Text> : null}
          {persistenceMessage ? <Text style={styles.noteText}>{persistenceMessage}</Text> : null}
        </GlowCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uploaded songs</Text>
          <View style={styles.list}>
            {isHydrating ? (
              <EmptyStateCard title="Restoring music library" description="Loading your locally saved songs and playlists." />
            ) : songs.length === 0 ? (
              <EmptyStateCard title="Upload your event music" description="Pick a local audio file to start building the event music library." />
            ) : (
              songs.map((song) => (
                <SongLibraryCard
                  key={song.id}
                  id={song.id}
                  songName={song.title || song.songName || "Track"}
                  artist={song.artist}
                  duration={song.duration}
                  fileType={song.fileType}
                  onAdd={() => addSong()}
                  onAssignTrackA={(songId) => assignSongToDeck("trackA", songId)}
                  onAssignTrackB={(songId) => assignSongToDeck("trackB", songId)}
                  onDelete={deleteSong}
                  onReorder={reorderSongs}
                />
              ))
            )}
          </View>
        </View>

        <GlowCard style={styles.uploadCard}>
          <Text style={styles.sectionTitle}>Create playlist</Text>
          <TextFieldInput label="Playlist name" value={playlistName} onChangeText={setPlaylistName} placeholder="Reception" />
          <View style={styles.buttonStack}>
            <NeonButton
              label="Create playlist"
              variant="secondary"
              onPress={() => {
                createPlaylist(playlistName);
                setPlaylistName("");
              }}
            />
            <NeonButton label="Assign songs to playlists" variant="secondary" onPress={assignSongsToPlaylist} />
          </View>
        </GlowCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playlists</Text>
          <View style={styles.list}>
            {playlists.length === 0 ? (
              <EmptyStateCard title="No playlists yet" description="Create the first playlist to start grouping songs for event moments." />
            ) : (
              playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  id={playlist.id}
                  name={playlist.name}
                  detail={playlist.detail}
                  songs={resolvePlaylistSongs(playlist.songIds)}
                  onAddSong={addSongToPlaylist}
                  onDeleteSong={(playlistId, songId) =>
                    confirmAction("Remove song from playlist?", "This will remove the song from this playlist right away.", () =>
                      deleteSongFromPlaylist(playlistId, songId),
                    )
                  }
                  onMoveSong={moveSongInPlaylist}
                  onAssignTrackA={(songId) => assignSongToDeck("trackA", songId)}
                  onAssignTrackB={(songId) => assignSongToDeck("trackB", songId)}
                />
              ))
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <NeonButton
            label="Save Music Library"
            onPress={() => {
              saveCurrentEventSnapshot({ status: "Music Ready" });
              navigation.navigate("Events", { screen: "EventOverview" });
            }}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: spacing.xl, paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.xl },
  header: { gap: spacing.sm },
  eyebrow: { color: colors.accent, textTransform: "uppercase", letterSpacing: 1.1, fontSize: 12, fontWeight: "800" },
  title: { color: colors.textPrimary, fontSize: 32, lineHeight: 36, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, maxWidth: 330 },
  uploadCard: { gap: spacing.md },
  section: { gap: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: "800" },
  sectionBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  noteText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  buttonStack: { gap: spacing.sm },
  warning: { color: colors.warning, fontSize: 13, lineHeight: 18 },
  list: { gap: spacing.md },
  footer: { gap: spacing.sm },
});
