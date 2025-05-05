import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
} from "react-native";
import { Typography } from "@/components/ui/Typography";
import { COLORS, SPACING, BORDER_RADIUS } from "@/lib/constants/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  isGift: boolean;
}

interface GiftModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (giftItems: string[], message: string) => void;
  cartItems: CartItem[];
}

export default function GiftModal({
  visible,
  onClose,
  onSave,
  cartItems,
}: GiftModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [giftMessage, setGiftMessage] = useState("");

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = () => {
    onSave(selectedItems, giftMessage);
    onClose();
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemInfo}>
          <Typography style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Typography>
          <Typography style={styles.itemPrice}>
            ₹{item.price} × {item.quantity}
          </Typography>
        </View>
      </View>
      <Switch
        value={selectedItems.includes(item.id)}
        onValueChange={() => toggleItemSelection(item.id)}
        trackColor={{ false: COLORS.GRAY_LIGHT, true: COLORS.PRIMARY_LIGHT }}
        thumbColor={
          selectedItems.includes(item.id) ? COLORS.PRIMARY : COLORS.WHITE
        }
      />
    </View>
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
            <Typography style={styles.title}>Gift Options</Typography>
            <View style={styles.placeholder} />
          </View>

          {/* Gift Instructions */}
          <View style={styles.instructionsContainer}>
            <Typography style={styles.instructionsText}>
              Select items to be packed as a gift. A gift bag and gift note will be included.
            </Typography>
          </View>

          {/* Items List */}
          <Typography style={styles.sectionTitle}>Select Items</Typography>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.itemsList}
            showsVerticalScrollIndicator={false}
          />

          {/* Gift Message */}
          <View style={styles.messageContainer}>
            <Typography style={styles.messageLabel}>Gift Message (Optional)</Typography>
            <TextInput
              style={styles.messageInput}
              placeholder="Write a message for the recipient..."
              value={giftMessage}
              onChangeText={setGiftMessage}
              multiline
              maxLength={100}
            />
            <Typography style={styles.characterCount}>
              {giftMessage.length}/100
            </Typography>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              selectedItems.length === 0 && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={selectedItems.length === 0}
          >
            <Typography
              style={[
                styles.saveButtonText,
                selectedItems.length === 0 && styles.saveButtonTextDisabled,
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
  instructionsContainer: {
    padding: 16,
    backgroundColor: COLORS.GRAY_LIGHTEST,
    marginBottom: 16,
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.TEXT_MEDIUM,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  itemsList: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTER,
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.SM,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: COLORS.TEXT_MEDIUM,
  },
  messageContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTER,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  messageInput: {
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.SM,
    padding: 12,
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    alignSelf: "flex-end",
    marginTop: 4,
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
