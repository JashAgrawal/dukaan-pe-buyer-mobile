import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface InfiniteScrollerProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  error?: string | null;
  onSeeAllPress?: () => void;
  onEndReached?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  horizontal?: boolean;
  contentContainerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  emptyText?: string;
  numColumns?: number;
  hideHeader?: boolean;
}

function InfiniteScroller<T>({
  title,
  subtitle,
  data = [],
  renderItem,
  keyExtractor,
  isLoading = false,
  error = null,
  onSeeAllPress,
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
  horizontal = true,
  contentContainerStyle,
  containerStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  emptyText = "No items available",
  numColumns,
  hideHeader = false,
}: InfiniteScrollerProps<T>) {
  // Render loading state
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#8A3FFC" />
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyText}</Text>
    </View>
  );

  // Render footer (loading indicator)
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#8A3FFC" />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header */}
      {!hideHeader && (
        <View style={[styles.header, headerStyle]}>
          <View>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
            )}
          </View>
          {onSeeAllPress && (
            <TouchableOpacity
              onPress={onSeeAllPress}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <MaterialIcons name="chevron-right" size={16} color="#8A3FFC" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content */}
      {isLoading && data.length === 0 ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : data.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          key={`${horizontal ? "horizontal" : "vertical"}-${numColumns || 1}`} // Add key to force re-render when layout changes
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal={horizontal}
          numColumns={numColumns}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            horizontal
              ? styles.horizontalScrollContent
              : styles.verticalScrollContent,
            contentContainerStyle,
          ]}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Jost-Bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Jost-Regular",
    color: "#666",
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#8A3FFC",
    marginRight: 2,
  },
  horizontalScrollContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  verticalScrollContent: {
    padding: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontFamily: "Jost-Regular",
    textAlign: "center",
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Jost-Regular",
  },
  footerLoader: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
});

export default InfiniteScroller;
