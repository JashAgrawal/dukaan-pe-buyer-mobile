import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Typography, H3, Body1 } from "@/components/ui/Typography";
import ShortAppHeader from "@/components/ui/ShortAppHeader";
import ScrollAwareWrapper from "@/components/ui/ScrollAwareWrapper";
import { useFavRoutesStore, FavRoute } from "@/stores/favRoutesStore";
import { getImageUrl } from "@/lib/helpers";
//@ts-ignore
import EmptyImg from "../../assets/images/empty-wishlist.jpg";

export default function FavRoutesScreen() {
  const { favRoutes, isLoading, removeFavRoute, loadFavRoutes } =
    useFavRoutesStore();

  // Refetch favRoutes when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadFavRoutes();
    }, [])
  );

  const handleStorePress = (storeId: string) => {
    router.navigate(`/store/${storeId}`);
  };

  const handleRemoveFavRoute = (id: string) => {
    removeFavRoute(id);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={EmptyImg} style={styles.emptyImage} />
      <Typography style={styles.emptyTitle}>No Saved Routes Yet</Typography>
      <Body1 style={styles.emptyText}>
        Add your favorite routes to quickly access them later.
      </Body1>
    </View>
  );

  const renderFavRouteItem = ({ item }: { item: FavRoute }) => (
    <TouchableOpacity
      style={styles.favRouteItem}
      onPress={() => handleStorePress(item.storeId)}
    >
      <View style={styles.favRouteContent}>
        {item.imageUrl ? (
          <Image
            source={{ uri: getImageUrl(item.imageUrl) }}
            style={styles.favRouteImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="store" size={24} color="#8A3FFC" />
          </View>
        )}
        <View style={styles.favRouteDetails}>
          <Typography style={styles.favRouteName}>{item.name}</Typography>
          <Typography style={styles.favRouteDate}>
            Added on {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavRoute(item.id)}
      >
        <MaterialIcons name="close" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollAwareWrapper
        headerComponent={
          <ShortAppHeader title="Saved Routes" showBackButton={false} />
        }
        isShortHeader={true}
      >
        <View style={styles.content}>
          <Text style={styles.title}>All Saved Routes</Text>
          <Body1 style={styles.description}>
            Your favorite store routes for quick access.
          </Body1>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8A3FFC" />
            </View>
          ) : favRoutes.length > 0 ? (
            <FlatList
              data={favRoutes}
              renderItem={renderFavRouteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.favRoutesList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollAwareWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  title: {
    fontSize: 24,
    fontFamily: "Jost-Medium",
    color: "#000000",
  },
  description: {
    marginTop: 4,
    marginBottom: 16,
    color: "#666666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  favRoutesList: {
    paddingBottom: 20,
  },
  favRouteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  favRouteContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  favRouteImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  favRouteDetails: {
    marginLeft: 12,
    flex: 1,
  },
  favRouteName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  favRouteDate: {
    fontSize: 12,
    color: "#666666",
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#666666",
    maxWidth: "80%",
  },
});
