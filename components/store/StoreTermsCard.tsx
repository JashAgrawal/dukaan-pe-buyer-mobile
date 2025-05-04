import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Typography, Body1 } from "@/components/ui/Typography";
import { Store } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";

const StoreTermsCard = ({ store }: { store: Store }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() =>
            openModal(
              "Terms & conditions",
              store.termsAndConditions || "No terms and conditions available."
            )
          }
        >
          <Typography style={styles.rowText}>Terms & conditions</Typography>
          <MaterialIcons name="chevron-right" size={24} color="#8A8A8A" />
        </TouchableOpacity>

        <View style={styles.dividerLine} />

        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() =>
            openModal(
              "Return & Refund Policy",
              store.returnPolicy || "No return policy available."
            )
          }
        >
          <Typography style={styles.rowText}>Return & Refund Policy</Typography>
          <MaterialIcons name="chevron-right" size={24} color="#8A8A8A" />
        </TouchableOpacity>
      </View>

      {/* Modal for displaying terms and policies */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Typography style={styles.modalTitle}>{modalTitle}</Typography>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={true}
            >
              {modalContent ? (
                <Body1 style={styles.modalText}>{modalContent}</Body1>
              ) : (
                <Body1 style={styles.placeholderText}>
                  No information available at this time. Please check back
                  later.
                </Body1>
              )}

              {/* Add some extra padding at the bottom for better scrolling */}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    paddingVertical: 12,
  },
  rowText: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    color: "#000",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Jost-Medium",
    color: "#000",
  },
  modalScrollView: {
    padding: 16,
    maxHeight: "70%",
  },
  modalText: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#333",
    lineHeight: 22,
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#777",
    lineHeight: 22,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});

export default StoreTermsCard;
