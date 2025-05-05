import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value <= min && styles.disabledButton]}
        onPress={handleDecrement}
        disabled={value <= min}
      >
        <MaterialIcons
          name="remove"
          size={16}
          color={value <= min ? COLORS.GRAY_MEDIUM : COLORS.TEXT_DARK}
        />
      </TouchableOpacity>
      
      <View style={styles.valueContainer}>
        <Typography style={styles.value}>{value}</Typography>
      </View>
      
      <TouchableOpacity
        style={[styles.button, value >= max && styles.disabledButton]}
        onPress={handleIncrement}
        disabled={value >= max}
      >
        <MaterialIcons
          name="add"
          size={16}
          color={value >= max ? COLORS.GRAY_MEDIUM : COLORS.TEXT_DARK}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    overflow: "hidden",
  },
  button: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.GRAY_LIGHTEST,
  },
  disabledButton: {
    opacity: 0.5,
  },
  valueContainer: {
    width: 32,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
});
