import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TipOption {
  value: number;
  label: string;
}

interface TipModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (tipAmount: number) => void;
  currentTip?: number;
}

export default function TipModal({
  visible,
  onClose,
  onSave,
  currentTip = 0,
}: TipModalProps) {
  const insets = useSafeAreaInsets();
  // Predefined tip options
  const tipOptions: TipOption[] = [
    { value: 10, label: "₹10" },
    { value: 20, label: "₹20" },
    { value: 30, label: "₹30" },
    { value: 50, label: "₹50" },
  ];

  const [selectedTip, setSelectedTip] = useState<number>(currentTip);
  const [customTip, setCustomTip] = useState<string>(
    currentTip > 0 && !tipOptions.some((option) => option.value === currentTip)
      ? currentTip.toString()
      : ""
  );

  const handleTipSelect = (value: number) => {
    setSelectedTip(value);
    setCustomTip("");
  };

  const handleCustomTipChange = (text: string) => {
    // Allow only numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setCustomTip(numericValue);

    if (numericValue) {
      setSelectedTip(parseInt(numericValue, 10));
    } else {
      setSelectedTip(0);
    }
  };

  const handleSave = () => {
    onSave(selectedTip);
    onClose();
  };

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
            <Typography style={styles.title}>Delivery Partner Tip</Typography>
            <View style={styles.placeholder} />
          </View>

          {/* Tip Description */}
          <View style={styles.descriptionContainer}>
            <Typography style={styles.descriptionText}>
              100% of the tip amount goes to your delivery partner. Tips are a great way to show your appreciation for their service.
            </Typography>
          </View>

          {/* Tip Options */}
          <View style={styles.optionsContainer}>
            {tipOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.tipOption,
                  selectedTip === option.value && styles.tipOptionSelected,
                ]}
                onPress={() => handleTipSelect(option.value)}
              >
                <Typography
                  style={[
                    styles.tipOptionText,
                    selectedTip === option.value && styles.tipOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Tip Input */}
          <View style={styles.customTipContainer}>
            <Typography style={styles.customTipLabel}>Custom Tip</Typography>
            <View style={styles.customTipInputContainer}>
              <Typography style={styles.currencySymbol}>₹</Typography>
              <TextInput
                style={styles.customTipInput}
                placeholder="Enter amount"
                keyboardType="number-pad"
                value={customTip}
                onChangeText={handleCustomTipChange}
                maxLength={4} // Limit to 4 digits (up to ₹9999)
              />
            </View>
          </View>

          {/* No Tip Option */}
          <TouchableOpacity
            style={styles.noTipButton}
            onPress={() => {
              setSelectedTip(0);
              setCustomTip("");
            }}
          >
            <Typography
              style={[
                styles.noTipText,
                selectedTip === 0 && styles.noTipTextSelected,
              ]}
            >
              No tip
            </Typography>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Typography style={styles.saveButtonText}>
              {selectedTip > 0 ? `Add ₹${selectedTip} Tip` : "Skip"}
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
  descriptionContainer: {
    padding: 16,
    backgroundColor: COLORS.GRAY_LIGHTEST,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  tipOption: {
    width: "48%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_LIGHTEST,
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  tipOptionSelected: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderColor: COLORS.PRIMARY,
  },
  tipOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  tipOptionTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  customTipContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTER,
  },
  customTipLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  customTipInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    marginRight: 4,
  },
  customTipInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: COLORS.TEXT_DARK,
  },
  noTipButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  noTipText: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    textDecorationLine: "underline",
  },
  noTipTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: "500",
  },
  saveButton: {
    margin: 16,
    height: 48,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SM,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
});
