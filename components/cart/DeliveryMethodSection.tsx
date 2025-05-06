import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

export type DeliveryMethod = 'delivery' | 'pickup';

interface DeliveryMethodOption {
  id: DeliveryMethod;
  title: string;
  subtitle: string;
  icon: string;
}

interface DeliveryMethodSectionProps {
  selectedMethod: DeliveryMethod;
  onSelectMethod: (method: DeliveryMethod) => void;
}

const deliveryMethodOptions: DeliveryMethodOption[] = [
  {
    id: 'delivery',
    title: "Home Delivery",
    subtitle: "Deliver to your address",
    icon: "local-shipping",
  },
  {
    id: 'pickup',
    title: "Store Pickup",
    subtitle: "Collect from the store",
    icon: "store",
  },
];

export default function DeliveryMethodSection({
  selectedMethod,
  onSelectMethod,
}: DeliveryMethodSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.title}>Delivery Method</Typography>
      </View>
      
      <View style={styles.optionsContainer}>
        {deliveryMethodOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              selectedMethod === option.id && styles.selectedOption,
            ]}
            onPress={() => onSelectMethod(option.id)}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons
                name={option.icon as any}
                size={20}
                color={selectedMethod === option.id ? COLORS.PRIMARY_DARK : COLORS.TEXT_LIGHT}
              />
            </View>
            
            <View style={styles.optionContent}>
              <Typography
                style={[
                  styles.optionTitle,
                  selectedMethod === option.id && styles.selectedOptionText,
                ]}
              >
                {option.title}
              </Typography>
              
              <Typography style={styles.optionSubtitle}>
                {option.subtitle}
              </Typography>
            </View>
            
            {selectedMethod === option.id && (
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
