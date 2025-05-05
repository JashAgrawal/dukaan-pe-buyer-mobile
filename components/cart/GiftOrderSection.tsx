import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface GiftOrderSectionProps {
  onPress: () => void;
}

export default function GiftOrderSection({ onPress }: GiftOrderSectionProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={require('@/assets/images/coin-left.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Typography style={styles.title}>Ordering a gift?</Typography>
        <Typography style={styles.subtitle}>Select items to pack in a gift bag!</Typography>
      </View>
      
      <MaterialIcons name="chevron-right" size={24} color={COLORS.TEXT_LIGHT} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.MD,
    backgroundColor: "#FFF0F5",
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.LIGHT,
  },
  imageContainer: {
    width: 48,
    height: 48,
    marginRight: SPACING.MD,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
});
