import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Share,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import { getImageUrl } from "@/lib/helpers";
import productService from "@/lib/api/services/productService";
import { Product } from "@/types/product";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SlimProductCard from "@/components/product/SlimProductCard";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import useIsProductInCartZustand from "@/hooks/useIsProductInCartZustand";
import QuantitySelector from "@/components/cart/QuantitySelector";

const { width, height } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    highlights: true,
    information: false,
  });
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [similarProductsLoading, setSimilarProductsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Cart related hooks
  const { isAuthenticated } = useAuth();
  const { addToCart, updateCartItem, removeCartItem, cart } = useCartStore();
  const { isInCart, quantity } = useIsProductInCartZustand(id as string);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id as string);
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details");
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setSimilarProductsLoading(true);
        // This is a mock implementation - in a real app, you would fetch similar products
        // based on the current product's category or other attributes
        const dummySimilarProducts = [
          {
            _id: "product1",
            name: "Potato 1 kg Combo",
            mainImage: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
            price: 60,
            sellingPrice: 22,
            averageRating: 4.6,
            reviewCount: 5700,
            type: "physical",
            category: "",
            store_id: "",
            store: "",
            popularityIndex: 0,
            orderCount: 0,
            wishlistCount: 0,
            inventory: 0,
            tags: [],
            createdAt: "",
            updatedAt: "",
          },
          {
            _id: "product2",
            name: "Lady Finger 250 g Combo",
            mainImage: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2",
            price: 40,
            sellingPrice: 15,
            averageRating: 4.5,
            reviewCount: 3200,
            type: "physical",
            category: "",
            store_id: "",
            store: "",
            popularityIndex: 0,
            orderCount: 0,
            wishlistCount: 0,
            inventory: 0,
            tags: [],
            createdAt: "",
            updatedAt: "",
          },
          {
            _id: "product3",
            name: "Capsicum 500 g Pack",
            mainImage: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31",
            price: 50,
            sellingPrice: 17,
            averageRating: 4.7,
            reviewCount: 4100,
            type: "physical",
            category: "",
            store_id: "",
            store: "",
            popularityIndex: 0,
            orderCount: 0,
            wishlistCount: 0,
            inventory: 0,
            tags: [],
            createdAt: "",
            updatedAt: "",
          },
        ];
        setSimilarProducts(dummySimilarProducts);
        setSimilarProductsLoading(false);
      } catch (err) {
        console.error("Error fetching similar products:", err);
        setSimilarProductsLoading(false);
      }
    };

    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };

  // Handle share button press
  const handleSharePress = async () => {
    if (product) {
      try {
        await Share.share({
          message: `Check out ${product.name} on Dukaan Pe!`,
          url: `https://dukaanpe.com/product/${product._id}`,
        });
      } catch (error) {
        console.error("Error sharing product:", error);
      }
    }
  };

  // Handle image scroll
  const handleImageScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  // Toggle section expansion
  const toggleSection = (section: 'highlights' | 'information') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/auth/phone");
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);

    // If product is already in cart, increment quantity
    if (isInCart) {
      updateCartItem({
        itemId: id as string, // Use product ID instead of cart item ID
        quantity: quantity + 1,
      })
        .then(() => {
          setIsAddingToCart(false);
        })
        .catch((error: Error) => {
          console.error("Error updating cart item:", error);
          setIsAddingToCart(false);
        });
    } else {
      // Add new item to cart
      addToCart({
        product: product._id,
        quantity: 1,
        store: product.store_id,
      })
        .then(() => {
          setIsAddingToCart(false);
        })
        .catch((error: Error) => {
          console.error("Error adding to cart:", error);
          setIsAddingToCart(false);
        });
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (!isAuthenticated) {
      router.push("/auth/phone");
      return;
    }

    setIsAddingToCart(true);
    console.log("Product page - handleQuantityChange - product id:", id);
    console.log("Product page - handleQuantityChange - newQuantity:", newQuantity);

    if (newQuantity === 0) {
      // Remove item from cart using product ID
      removeCartItem({
        itemId: id as string, // Use product ID instead of cart item ID
      })
        .then(() => {
          console.log("Product page - item removed successfully");
          setIsAddingToCart(false);
        })
        .catch((error: Error) => {
          console.error("Error removing cart item:", error);
          setIsAddingToCart(false);
        });
    } else {
      // Update quantity using product ID
      updateCartItem({
        itemId: id as string, // Use product ID instead of cart item ID
        quantity: newQuantity,
      })
        .then(() => {
          console.log("Product page - quantity updated successfully");
          setIsAddingToCart(false);
        })
        .catch((error: Error) => {
          console.error("Error updating cart item:", error);
          setIsAddingToCart(false);
        });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#8A3FFC" />
      </View>
    );
  }

  // Render error state
  if (error || !product) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <StatusBar style="dark" />
        <Typography style={styles.errorText}>{error || "Product not found"}</Typography>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Typography style={styles.retryButtonText}>Go Back</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.price > product.sellingPrice
    ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
    : 0;

  // Prepare images for carousel
  const productImages = product.allImages && product.allImages.length > 0
    ? [product.mainImage, ...product.allImages]
    : [product.mainImage];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Typography style={styles.headerTitle} numberOfLines={1}>
            {product.name}
          </Typography>
          <Typography style={styles.headerPrice}>
            ₹{product.sellingPrice} <Typography style={styles.headerOriginalPrice}>₹{product.price}</Typography>
          </Typography>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
            <MaterialIcons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleSharePress}>
            <MaterialIcons name="share" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image Carousel */}
        <View style={styles.imageCarouselContainer}>
          <FlatList
            ref={flatListRef}
            data={productImages}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.startsWith('http') ? item : getImageUrl(item) }}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => `image-${index}`}
          />

          {/* Image Carousel Controls */}
          <View style={styles.imageControls}>
            <TouchableOpacity style={styles.imageControlButton}>
              <MaterialIcons name="favorite-border" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Image Carousel Pagination */}
          <View style={styles.pagination}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Info Card */}
        <View style={styles.productInfoCard}>
          <View style={styles.productInfoHeader}>
            <Typography style={styles.productName}>{product.name}</Typography>
            <View style={styles.productQuantity}>
              <Typography style={styles.quantityText}>1 kg</Typography>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingPill}>
              <Typography style={styles.ratingText}>{product.averageRating || 4.6}</Typography>
              <Ionicons name="star" size={12} color="#FFFFFF" />
            </View>
            <Typography style={styles.reviewCount}>
              ({product.reviewCount ? (product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount) : '55.7k'})
            </Typography>
          </View>

          <View style={styles.priceContainer}>
            <Typography style={styles.price}>₹{product.sellingPrice}</Typography>
            {discountPercentage > 0 && (
              <>
                <Typography style={styles.originalPrice}>₹{product.price}</Typography>
                <View style={styles.discountPill}>
                  <Typography style={styles.discountText}>{discountPercentage}% Off</Typography>
                </View>
              </>
            )}
          </View>

          <View style={styles.deliveryInfoContainer}>
            <Ionicons name="flash-outline" size={18} color="#00A86B" />
            <Typography style={styles.deliveryInfoText}>Estimated Delivery Time: 7 mins</Typography>
          </View>
        </View>

        {/* Delivery Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <MaterialIcons name="block" size={20} color="#333" />
            </View>
            <Typography style={styles.featureText}>No Return Or Exchange</Typography>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <MaterialIcons name="delivery-dining" size={20} color="#333" />
            </View>
            <Typography style={styles.featureText}>Fast Delivery</Typography>
          </View>
        </View>

        {/* Highlights Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('highlights')}
            activeOpacity={0.7}
          >
            <Typography style={styles.sectionTitle}>Highlights</Typography>
            <MaterialIcons
              name={expandedSections.highlights ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          {expandedSections.highlights && (
            <View style={styles.sectionContent}>
              <View style={styles.highlightRow}>
                <Typography style={styles.highlightLabel}>Imported</Typography>
                <Typography style={styles.highlightValue}>No</Typography>
              </View>
              <View style={styles.highlightRow}>
                <Typography style={styles.highlightLabel}>Product Type</Typography>
                <Typography style={styles.highlightValue}>Onion</Typography>
              </View>
            </View>
          )}
        </View>

        {/* Information Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('information')}
            activeOpacity={0.7}
          >
            <Typography style={styles.sectionTitle}>Information</Typography>
            <MaterialIcons
              name={expandedSections.information ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          {expandedSections.information && (
            <View style={styles.sectionContent}>
              <View style={styles.infoRow}>
                <Typography style={styles.infoLabel}>Disclaimer</Typography>
                <Typography style={styles.infoValue}>
                  All images are for representational purposes only. It is advised that you read the batch and manufacturing details, directions for use, allergen information, health and nutritional claims (wherever applicable), and other details mentioned on the label before consuming the product. For combo items, individual prices can be seen on the page.
                </Typography>
              </View>
              <View style={styles.infoRow}>
                <Typography style={styles.infoLabel}>Customer Care Details</Typography>
                <Typography style={styles.infoValue}>
                  In case of any issue, contact us{'\n'}
                  E-mail address: support@zeptonow.com
                </Typography>
              </View>
              <TouchableOpacity style={styles.viewMoreButton}>
                <Typography style={styles.viewMoreText}>View more</Typography>
                <MaterialIcons name="keyboard-arrow-down" size={16} color="#FF3B7F" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Similar Products Section */}
        <View style={styles.similarProductsContainer}>
          <Typography style={styles.similarProductsTitle}>Similar Products</Typography>
          <View style={styles.similarProductsGrid}>
            {similarProductsLoading ? (
              <ActivityIndicator size="small" color="#8A3FFC" />
            ) : (
              similarProducts.map((item) => (
                <View key={item._id} style={styles.similarProductCard}>
                  <SlimProductCard
                    id={item._id}
                    name={item.name}
                    imageUrl={item.mainImage}
                    price={item.sellingPrice}
                    originalPrice={item.price}
                    rating={item.averageRating}
                    reviewCount={item.reviewCount}
                    deliveryTime="7 Mins"
                  />
                </View>
              ))
            )}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={[styles.addToCartContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <TouchableOpacity onPress={() => router.push("/cart")} style={styles.cartCountContainer}>
          {cart && cart.items.length > 0 && (
            <View style={styles.cartCount}>
              <Typography style={styles.cartCountText}>{cart.items.length}</Typography>
            </View>
          )}
          <Feather name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>

        {isInCart ? (
          <View style={styles.quantitySelectorContainer}>
            <QuantitySelector
              value={quantity}
              onChange={handleQuantityChange}
              min={0}
              max={99}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Typography style={styles.addToCartText}>Add to cart</Typography>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#8A3FFC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  headerPrice: {
    fontSize: 14,
    // fontWeight: "500",
    fontFamily: "Jost-Medium",
    color: "#333333",
  },
  headerOriginalPrice: {
    fontSize: 12,
    color: "#999999",
    textDecorationLine: "line-through",
  },
  headerActions: {
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
  },
  imageCarouselContainer: {
    paddingHorizontal: 16,
    width: width,
    height: height * 0.6,
    backgroundColor: "#FFFFFF",
  },
  productImage: {
    width: width*0.9,
    height: "auto",
    borderRadius: 16,
    resizeMode: "contain",
    marginRight: 8,
  },
  imageControls: {
    position: "absolute",
    top: 16,
    left: 20,
    flexDirection: "row",
  },
  imageControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#8A3FFC",
    width: 16,
  },
  productInfoCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
  },
  productInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    // fontWeight: "600",
    fontFamily: "Jost-Medium",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  productQuantity: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 14,
    color: "#666666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    // fontWeight: "700",
    fontFamily: "Jost-SemiBold",
    color: "#333333",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountPill: {
    backgroundColor: "#FFE8EC",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF3B7F",
  },
  deliveryInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryInfoText: {
    fontSize: 14,
    color: "#00A86B",
    marginLeft: 6,
  },
  featuresContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
  },
  featureItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  sectionContent: {
    padding: 16,
  },
  highlightRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  highlightLabel: {
    width: 120,
    fontSize: 14,
    color: "#666666",
  },
  highlightValue: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: "#FF3B7F",
    marginRight: 4,
  },
  similarProductsContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  similarProductsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  similarProductsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  similarProductCard: {
    width: "48%",
    marginBottom: 16,
  },
  addToCartContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  cartCountContainer: {
    marginRight: 24,
    width: 40,

  },
  cartCount: {
    position: "absolute",
    top: -12,
    right: -12,
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: "#FF3B7F",
    justifyContent: "center",
    alignItems: "center",
  },
  cartCountText: {
    fontSize: 12,
    // fontWeight: "600",
    fontFamily: "Jost-Medium",
    lineHeight: 12,
    color: "#FFFFFF",
  },
  addToCartButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#FF3B7F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  quantitySelectorContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
});
