import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../../components/ui/Button";
import { pollsApi } from "../../../services/api";

export default function PollDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedChoice, setVotedChoice] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Fetch poll detail
  useEffect(() => {
    setLoading(true);
    pollsApi
      .get(`${id}/`)
      .then((res) => {
        setPoll(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load poll");
        setLoading(false);
      });
  }, [id]);

  // Handle voting
  const handleVote = async (choiceId) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await pollsApi.post(`${id}/vote/`, { choice: choiceId });
      setSuccessMsg(res.data.message || "Vote submitted successfully.");
      setVotedChoice(choiceId);
      const updated = await pollsApi.get(`${id}/`);
      setPoll(updated.data);
    } catch (err) {
      // User-friendly error message extraction
      let msg = err?.response?.data?.detail || err?.response?.data?.message;
      if (!msg && err?.response?.data && typeof err.response.data === "object") {
        if (err.response.data.error && typeof err.response.data.error === "string") {
          msg = err.response.data.error;
        } else {
          // Try to extract all string values from the error object
          const values = Object.values(err.response.data).filter(v => typeof v === "string");
          if (values.length > 0) msg = values.join(". ");
        }
      }
      if (!msg && typeof err?.response?.data === "string") {
        msg = err.response.data;
      }
      setError(msg || "Failed to submit vote. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <CurvedHeader title="Poll" showBack onBack={() => router.back()} /> */}
      <View style={styles.container}>
        <Text style={styles.question}>{poll.question}</Text>
        <Text style={styles.meta}>
          Created: {new Date(poll.created_at).toLocaleString()}
        </Text>
        <View style={styles.choicesContainer}>
          {poll.choices.map((choice) => {
            const isVoted = votedChoice === choice.id;
            return (
              <TouchableOpacity
                key={choice.id}
                style={[
                  styles.choice,
                  (isVoted || votedChoice) && styles.choiceDisabled,
                  isVoted && styles.choiceSelected,
                ]}
                disabled={!!votedChoice}
                onPress={() => handleVote(choice.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.choiceText}>{choice.text}</Text>
                <View style={styles.voteCountBox}>
                  <Text style={styles.voteCount}>{choice.votes}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {successMsg ? (
          <Text style={styles.success}>{successMsg}</Text>
        ) : null}
        {votedChoice && (
          <Button
            title="Back to Polls"
            onPress={() => router.back()}
            style={{ marginTop: 24 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  meta: {
    fontSize: 13,
    color: "#888",
    marginBottom: 24,
  },
  choicesContainer: {
    marginBottom: 24,
  },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  choiceText: {
    flex: 1,
    fontSize: 17,
    color: "#222",
  },
  voteCountBox: {
    backgroundColor: "#A855F7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  voteCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  choiceSelected: {
    borderColor: "#A855F7",
    backgroundColor: "#ede9fe",
  },
  choiceDisabled: {
    opacity: 0.7,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  error: {
    color: "#b91c1c",
    fontSize: 16,
    marginBottom: 16,
  },
  success: {
    color: "#16a34a",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
});