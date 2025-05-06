import React from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";

interface CustomerNotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function CustomerNotesSection({
  notes,
  onNotesChange,
  placeholder = "Add any special instructions or notes for your order...",
  maxLength = 200,
}: CustomerNotesSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text>
            <MaterialIcons name="note" size={20} color={COLORS.PRIMARY} />
          </Text>
          <Typography style={styles.title}>Special Instructions</Typography>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={notes}
          onChangeText={onNotesChange}
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
          placeholderTextColor={COLORS.PRIMARY}
        />
        <Typography style={styles.characterCount}>
          {notes.length}/{maxLength}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: SPACING.XS,
    color: COLORS.TEXT_DARK,
  },
  inputContainer: {
    padding: SPACING.MD,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.SM,
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#000000",
    backgroundColor: COLORS.GRAY_LIGHTEST,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
