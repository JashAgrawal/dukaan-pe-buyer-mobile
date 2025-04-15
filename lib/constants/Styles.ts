import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

// Font families
export const FONTS = {
  REGULAR: "Jost-Regular",
  MEDIUM: "Jost-Medium",
  SEMIBOLD: "Jost-SemiBold",
  BOLD: "Jost-Bold",
  BLACK: "Jost-Black",
  MONTSERRAT_BOLD: "Montserrat-Bold",
};

// Font sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
  HUGE: 32,
};

// Line heights
export const LINE_HEIGHTS = {
  XS: 16,
  SM: 20,
  MD: 24,
  LG: 28,
  XL: 32,
  XXL: 36,
  XXXL: 40,
};

// Colors
export const COLORS = {
  PRIMARY: "#874BF9", // Main purple
  PRIMARY_LIGHT: "#C8A2FF", // Light purple
  PRIMARY_DARK: "#8A3FFC", // Dark purple
  ACCENT: "#CCFE00", // Theme green
  TEXT_DARK: "#000000",
  TEXT_MEDIUM: "#333333",
  TEXT_LIGHT: "#666666",
  TEXT_LIGHTER: "#999999",
  GRAY_DARK: "#696969",
  GRAY_MEDIUM: "#AAAAAA",
  GRAY_LIGHT: "#D4D4D4",
  GRAY_LIGHTER: "#EEEEEE",
  GRAY_LIGHTEST: "#F5F5F5",
  BORDER: "#F0F0F0",
  WHITE: "#FFFFFF",
  SUCCESS: "#4CAF50",
  ERROR: "#FF3B30",
  WARNING: "#FFC107",
  INFO: "#2196F3",
  TRANSPARENT: "transparent",
  OVERLAY: "rgba(0, 0, 0, 0.5)",
  OVERLAY_LIGHT: "rgba(0, 0, 0, 0.3)",
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
  HUGE: 40,
};

// Border radius
export const BORDER_RADIUS = {
  XS: 4,
  SM: 8,
  MD: 10,
  LG: 12,
  XL: 16,
  XXL: 20,
  ROUND: 50,
};

// Shadows
export const SHADOWS = {
  LIGHT: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  MEDIUM: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  HEAVY: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Common text styles
export const TEXT_STYLES = StyleSheet.create({
  // Headings
  h1: {
    fontFamily: FONTS.BOLD,
    fontSize: FONT_SIZES.HUGE,
    lineHeight: LINE_HEIGHTS.XXXL,
    color: COLORS.TEXT_DARK,
  },
  h2: {
    fontFamily: FONTS.BOLD,
    fontSize: FONT_SIZES.XXXL,
    lineHeight: LINE_HEIGHTS.XXL,
    color: COLORS.TEXT_DARK,
  },
  h3: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: FONT_SIZES.XXL,
    lineHeight: LINE_HEIGHTS.XL,
    color: COLORS.TEXT_DARK,
  },
  h4: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: FONT_SIZES.XL,
    lineHeight: LINE_HEIGHTS.LG,
    color: COLORS.TEXT_DARK,
  },
  h5: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FONT_SIZES.LG,
    lineHeight: LINE_HEIGHTS.MD,
    color: COLORS.TEXT_DARK,
  },
  h6: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FONT_SIZES.MD,
    lineHeight: LINE_HEIGHTS.MD,
    color: COLORS.TEXT_DARK,
  },

  // Body text
  body1: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.MD,
    lineHeight: LINE_HEIGHTS.MD,
    color: COLORS.TEXT_MEDIUM,
  },
  body2: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.SM,
    lineHeight: LINE_HEIGHTS.SM,
    color: COLORS.TEXT_MEDIUM,
  },
  caption: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.XS,
    lineHeight: LINE_HEIGHTS.XS,
    color: COLORS.TEXT_LIGHT,
  },

  // Special text styles
  link: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FONT_SIZES.MD,
    lineHeight: LINE_HEIGHTS.MD,
    color: COLORS.PRIMARY_DARK,
  },
  error: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.SM,
    lineHeight: LINE_HEIGHTS.SM,
    color: COLORS.ERROR,
  },
  success: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.SM,
    lineHeight: LINE_HEIGHTS.SM,
    color: COLORS.SUCCESS,
  },
  
  // Card text styles
  cardTitle: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: FONT_SIZES.MD,
    lineHeight: LINE_HEIGHTS.MD,
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  cardSubtitle: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FONT_SIZES.SM,
    lineHeight: LINE_HEIGHTS.SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.XS,
  },
  cardContent: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.SM,
    lineHeight: LINE_HEIGHTS.SM,
    color: COLORS.TEXT_MEDIUM,
  },
  
  // Button text styles
  buttonPrimary: {
    fontFamily: FONTS.BOLD,
    fontSize: FONT_SIZES.MD,
    color: COLORS.WHITE,
    textAlign: "center",
  },
  buttonSecondary: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FONT_SIZES.MD,
    color: COLORS.PRIMARY_DARK,
    textAlign: "center",
  },
});

// Common container styles
export const CONTAINER_STYLES = StyleSheet.create({
  // Screen containers
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  screenContainerWithPadding: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: SPACING.LG,
  },
  screenContainerGray: {
    flex: 1,
    backgroundColor: COLORS.GRAY_LIGHTEST,
  },
  
  // Content containers
  contentContainer: {
    padding: SPACING.LG,
  },
  contentContainerWithScroll: {
    paddingBottom: SPACING.HUGE,
  },
  
  // Section containers
  section: {
    marginBottom: SPACING.XL,
  },
  sectionWithBorder: {
    marginBottom: SPACING.XL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    paddingBottom: SPACING.LG,
  },
  
  // Row containers
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Center containers
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Card styles
export const CARD_STYLES = StyleSheet.create({
  // Basic card
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.LIGHT,
  },
  
  // Store card
  storeCard: {
    width: "100%",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    overflow: "hidden",
    marginBottom: SPACING.MD,
    maxWidth: 300,
    ...SHADOWS.MEDIUM,
  },
  
  // Small store card
  smallStoreCard: {
    width: "100%",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    overflow: "hidden",
    maxWidth: 140,
    marginBottom: SPACING.MD,
    ...SHADOWS.MEDIUM,
  },
  
  // Info card
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    ...SHADOWS.LIGHT,
  },
  
  // Image container in cards
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  smallImageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
  // Card content container
  cardContent: {
    padding: SPACING.MD,
  },
});

// Button styles
export const BUTTON_STYLES = StyleSheet.create({
  // Primary button
  primaryButton: {
    backgroundColor: COLORS.PRIMARY_DARK,
    borderRadius: BORDER_RADIUS.SM,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.LG,
  },
  
  // Secondary button
  secondaryButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_DARK,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.LG,
  },
  
  // Icon button
  iconButton: {
    padding: SPACING.SM,
  },
  
  // Favorite button
  favoriteButton: {
    position: "absolute",
    top: SPACING.MD,
    right: SPACING.MD,
    zIndex: 10,
  },
  favoriteButtonInner: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.XXL,
    backgroundColor: COLORS.OVERLAY_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  smallFavoriteButtonInner: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.OVERLAY_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Header styles
export const HEADER_STYLES = StyleSheet.create({
  // Basic header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
  },
  
  // App header
  appHeader: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  
  // Header with back button
  headerWithBack: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  
  // Back button
  backButton: {
    marginRight: SPACING.LG,
  },
  
  // Header title
  headerTitle: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT_DARK,
  },
});

// Badge styles
export const BADGE_STYLES = StyleSheet.create({
  // Basic badge
  badge: {
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.XS,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  
  // Status badges
  successBadge: {
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.XS,
    backgroundColor: COLORS.SUCCESS,
  },
  errorBadge: {
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.XS,
    backgroundColor: COLORS.ERROR,
  },
  warningBadge: {
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.XS,
    backgroundColor: COLORS.WARNING,
  },
  
  // Badge text
  badgeText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FONT_SIZES.XS,
    color: COLORS.WHITE,
  },
});

// Input styles
export const INPUT_STYLES = StyleSheet.create({
  // Basic input
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.LG,
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_DARK,
  },
  
  // Input with icon
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.LG,
  },
  
  // Search input
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.LG,
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_DARK,
    backgroundColor: COLORS.GRAY_LIGHTEST,
  },
  
  // Input label
  inputLabel: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_MEDIUM,
    marginBottom: SPACING.XS,
  },
  
  // Error message
  errorMessage: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONT_SIZES.XS,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
  },
});

// Divider styles
export const DIVIDER_STYLES = StyleSheet.create({
  // Horizontal divider
  horizontal: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    width: "100%",
    marginVertical: SPACING.MD,
  },
  
  // Vertical divider
  vertical: {
    width: 1,
    backgroundColor: COLORS.BORDER,
    height: "100%",
    marginHorizontal: SPACING.MD,
  },
});

// Export all styles
export default {
  FONTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TEXT_STYLES,
  CONTAINER_STYLES,
  CARD_STYLES,
  BUTTON_STYLES,
  HEADER_STYLES,
  BADGE_STYLES,
  INPUT_STYLES,
  DIVIDER_STYLES,
};
