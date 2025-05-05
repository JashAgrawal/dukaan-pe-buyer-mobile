import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface DeliveryOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface DeliveryOptionsSectionProps {
  options: DeliveryOption[];
  selectedOptionId: string;
  onSelectOption: (optionId: string) => void;
  onAddDetailsPress?: () => void;
}

export default function DeliveryOptionsSection({
  options,
  selectedOptionId,
  onSelectOption,
  onAddDetailsPress,
}: DeliveryOptionsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.title}>Ordering for someone else?</Typography>
        
        {onAddDetailsPress && (
          <TouchableOpacity 
          disabled
            style={styles.addDetailsButton}
            onPress={onAddDetailsPress}
            activeOpacity={0.7}
          >
            <Typography style={styles.addDetailsText}>Comming soon</Typography>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              selectedOptionId === option.id && styles.selectedOption,
            ]}
            onPress={() => onSelectOption(option.id)}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons
                name={option.icon as any}
                size={20}
                color={selectedOptionId === option.id ? COLORS.PRIMARY_DARK : COLORS.TEXT_LIGHT}
              />
            </View>
            
            <View style={styles.optionContent}>
              <Typography
                style={[
                  styles.optionTitle,
                  selectedOptionId === option.id && styles.selectedOptionText,
                ]}
              >
                {option.title}
              </Typography>
              
              <Typography style={styles.optionSubtitle}>
                {option.subtitle}
              </Typography>
            </View>
            
            {selectedOptionId === option.id && (
              <MaterialIcons name="check-circle" size={20} color={COLORS.PRIMARY_DARK} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  addDetailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#FF3B7F",
    borderRadius: BORDER_RADIUS.SM,
  },
  addDetailsText: {
    fontSize: 12,
    color: "#FF3B7F",
    fontWeight: "500",
  },
  optionsContainer: {
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  selectedOption: {
    backgroundColor: "#F0E7FF",
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  selectedOptionText: {
    color: COLORS.PRIMARY_DARK,
  },
  optionSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
});
