import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface InstructionOption {
  id: string;
  text: string;
}

interface InstructionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (instructions: string) => void;
  currentInstructions?: string;
}

export default function InstructionsModal({
  visible,
  onClose,
  onSave,
  currentInstructions = "",
}: InstructionsModalProps) {
  const insets = useSafeAreaInsets();
  const [instructions, setInstructions] = useState<string>(currentInstructions);

  // Predefined instruction options
  const instructionOptions: InstructionOption[] = [
    { id: "1", text: "Leave at the door" },
    { id: "2", text: "Call when you arrive" },
    { id: "3", text: "Ring the doorbell" },
    { id: "4", text: "Hand it to me" },
    { id: "5", text: "Leave with security" },
  ];

  const handleOptionSelect = (text: string) => {
    setInstructions(text);
  };

  const handleSave = () => {
    onSave(instructions.trim());
    onClose();
  };

  const renderOption = ({ item }: { item: InstructionOption }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleOptionSelect(item.text)}
    >
      <Typography style={styles.optionText}>{item.text}</Typography>
      <MaterialIcons name="add" size={20} color={COLORS.PRIMARY} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.content,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={COLORS.TEXT_DARK} />
            </TouchableOpacity>
            <Typography style={styles.title}>Delivery Instructions</Typography>
            <View style={styles.placeholder} />
          </View>

          {/* Instructions Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add delivery instructions..."
              value={instructions}
              onChangeText={setInstructions}
              multiline
              maxLength={200}
            />
            <Typography style={styles.characterCount}>
              {instructions.length}/200
            </Typography>
          </View>

          {/* Suggested Instructions */}
          <Typography style={styles.sectionTitle}>Suggested Instructions</Typography>
          <FlatList
            data={instructionOptions}
            renderItem={renderOption}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.optionsList}
            showsVerticalScrollIndicator={false}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              !instructions.trim() && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!instructions.trim()}
          >
            <Typography
              style={[
                styles.saveButtonText,
                !instructions.trim() && styles.saveButtonTextDisabled,
              ]}
            >
              Save
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  placeholder: {
    width: 40,
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  optionsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
  },
  saveButton: {
    margin: 16,
    height: 48,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SM,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  saveButtonTextDisabled: {
    color: COLORS.GRAY_MEDIUM,
  },
});
