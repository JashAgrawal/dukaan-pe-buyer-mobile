import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface MissedItemsSectionProps {
  onAddMorePress: () => void;
}

export default function MissedItemsSection({ onAddMorePress }: MissedItemsSectionProps) {
  return (
    <View style={styles.container}>
      <Typography style={styles.title}>Missed something?</Typography>
      
      <TouchableOpacity 
        style={styles.addMoreButton}
        onPress={onAddMorePress}
        activeOpacity={0.7}
      >
        <MaterialIcons name="add" size={20} color={COLORS.WHITE} />
        <Typography style={styles.addMoreText}>Add More Items</Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.SM,
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.WHITE,
    marginLeft: 4,
  },
});
