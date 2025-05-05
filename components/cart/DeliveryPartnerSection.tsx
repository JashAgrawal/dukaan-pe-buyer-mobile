import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";

interface DeliveryPartnerSectionProps {
  onTipPress: () => void;
  onInstructionsPress: () => void;
  onSafetyPress: () => void;
}

export default function DeliveryPartnerSection({
  onTipPress,
  onInstructionsPress,
  onSafetyPress,
}: DeliveryPartnerSectionProps) {
  return (
    <View style={styles.container}>
      {/* Tip Section */}
      <TouchableOpacity 
        style={styles.sectionItem}
        onPress={onTipPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="attach-money" size={20} color={COLORS.TEXT_DARK} />
        </View>
        
        <View style={styles.contentContainer}>
          <Typography style={styles.sectionTitle}>Delivery Partner Tip</Typography>
          <Typography style={styles.sectionSubtitle}>This amount goes to your delivery partner</Typography>
        </View>
        
        <MaterialIcons name="chevron-right" size={20} color={COLORS.TEXT_LIGHT} />
      </TouchableOpacity>
      
      {/* Instructions Section */}
      <TouchableOpacity 
        style={styles.sectionItem}
        onPress={onInstructionsPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="message" size={20} color={COLORS.TEXT_DARK} />
        </View>
        
        <View style={styles.contentContainer}>
          <Typography style={styles.sectionTitle}>Delivery Instructions</Typography>
          <Typography style={styles.sectionSubtitle}>Delivery partner will be notified</Typography>
        </View>
        
        <MaterialIcons name="chevron-right" size={20} color={COLORS.TEXT_LIGHT} />
      </TouchableOpacity>
      
      {/* Safety Section */}
      <TouchableOpacity 
        style={[styles.sectionItem, styles.lastItem]}
        onPress={onSafetyPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="local-shipping" size={20} color={COLORS.TEXT_DARK} />
        </View>
        
        <View style={styles.contentContainer}>
          <Typography style={styles.sectionTitle}>Delivery Partner's Safety</Typography>
          <Typography style={styles.sectionSubtitle}>Learn more about how we ensure their safety</Typography>
        </View>
        
        <MaterialIcons name="chevron-right" size={20} color={COLORS.TEXT_LIGHT} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    overflow: "hidden",
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.GRAY_LIGHTEST,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
});
