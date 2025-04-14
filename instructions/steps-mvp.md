---
# **Detailed Plan to Build Dune (MVP)**
---

## 🏁 **Phase 1: Core Setup and Structure**

### 1. **Project Setup**

- **Tools:**
  - **React Native with Expo** (cross-platform mobile app)
  - **TypeScript** (for type safety)
  - **Zustand** (lightweight state management)
  - **React Query** (for data fetching)
  - **Nativewind** (for TailwindCSS utility classes)
  - **Razorpay** (for payment)
  - **Google API** (for location)

---

## **Phase 2: Completed Features (Recap)**

1. **Authentication Flow:**

   - Login/Signup functionality is complete.

2. **Location Setup:**

   - Auto-detect and manual location selection are done.

3. **Home Screen:**

   - Displays list of stores near the user, categorized and searchable.

4. **Search Screen:**
   - Allows searching for stores by name or category.

---

## ✅ **Phase 3: Features to Implement Next (Favorites, Store Profile, FavRoutes, Deep Linking)**

---

### **1. Favorites System**

**Objective**: Enable users to mark stores as their favorites for easy access later.

#### **Tasks:**

1. **Create Zustand Store for Favorites:**

   - **File:** `src/stores/favorites.ts`
   - **State:**
     - `favoriteStores: string[]` — List of favorite store IDs.
   - **Actions:**
     - `addFavorite(storeId: string)`
     - `removeFavorite(storeId: string)`
     - **Persist Favorites** (optional): Use **AsyncStorage** or **SecureStore** to persist favorites data across app restarts.

2. **Add Favorite Button to StoreCard:**
   - Display a heart icon (❤️) on each store card.
   - If store is marked as favorite, show filled heart; otherwise, empty.
   - On click, call `addFavorite` or `removeFavorite` function.
3. **Display Favorites List:**

   - Create a `FavoritesScreen.tsx` to list all favorite stores.
   - Fetch stores from the `favoriteStores` array and display as a list.

4. **Optional: Display Toast Notifications**:
   - Show a toast message (e.g., "Added to Favorites") when a store is added or removed from favorites.

---

### **2. Store Profile Page**

**Objective**: Show detailed information about a specific store when the user clicks on a store.

#### **Tasks:**

1. **Create Store Profile Screen:**

   - **File:** `src/screens/StoreProfileScreen.tsx`
   - **UI Elements:**
     - Store Name, Category, Avg Rating, Open Timings.
     - Address (with a "Get Directions" button).
     - Store Gallery (image carousel or grid of store images).
     - Contact Information (with "Call" button).
     - List of Available Facilities (e.g., Free WiFi, Parking, Delivery).
     - Reviews (average rating and snippets of reviews).

2. **Store Metadata:**

   - Add metadata to the store (e.g., **storeType** like **Ecommerce**, **QSR**, **Appointment**).
   - This will help customize the "Visit Store" functionality.

3. **"Visit Store" Button:**
   - Button that will later transform the app into the specific store type’s functionality (like e-commerce view, table booking, appointment booking, etc.).

---

### **3. FavRoutes System (Route Favorites)**

**Objective**: Allow users to save their frequent store routes for easy navigation.

#### **Tasks:**

1. **Create FavRoutes State:**

   - **File:** `src/stores/favRoutes.ts`
   - **State:**
     - `favRoutes: string[]` — List of store IDs.
   - **Actions:**
     - `addFavRoute(storeId: string)`
     - `removeFavRoute(storeId: string)`

2. **Add Route Button to Store Profile:**

   - **Button:** "Add to FavRoute"
   - If the user taps it, call `addFavRoute` to save the store in their FavRoutes.

3. **Show Favorite Routes in Navigation:**
   - Show **Saved Routes** in the bottom tab or a separate **FavRoutes Screen** that lists all routes.
   - When clicked, show store profile or navigate to store’s **dynamic app**.

---

### **4. Deep Linking / QR Code (Basic Setup)**

**Objective**: Allow opening stores directly through deep links or QR codes.

#### **Tasks:**

1. **Setup Expo Linking:**

   - **File:** `src/utils/deepLinking.ts`
   - Use `Linking` API from **Expo** to handle deep linking.
   - Define deep link URLs like `dune://store/{storeId}`.

2. **Handle Deep Links:**
   - On app launch or from a link, capture the deep link and navigate to the corresponding **StoreProfileScreen**.
3. **QR Code Scanning:**
   - Use **expo-camera** to scan QR codes.
   - Parse QR code to extract store ID and navigate to the correct store profile.

---

## ✅ **Phase 4: MVP Features Completed**

By the end of this phase, these MVP features will be implemented:

| Feature                       | Status |
| ----------------------------- | ------ |
| Authentication                | ✅     |
| Location Setup                | ✅     |
| Home Screen (Store Discovery) | ✅     |
| Search Screen (Search Stores) | ✅     |
| Favorites                     | ✅     |
| Store Profile                 | ✅     |
| FavRoutes (Save Routes)       | ✅     |
| Deep Linking / QR Codes       | ✅     |

---

## ✅ **Phase 5: Payment Integration (Razorpay)**

Once the core app is working, the next step will be **Razorpay payment integration** for ecommerce stores.

---

### **Payment Flow with Razorpay:**

1. **On Store Profile (Ecommerce or QSR)**:
   - User will click "Proceed to Checkout" for an ecommerce store or restaurant.
2. **Create Razorpay Order (Backend)**:
   - Call your backend to create a Razorpay order.
   - Include the order amount, currency, store ID, etc.
3. **Integrate Razorpay SDK**:
   - In the app, once Razorpay order is created, use the Razorpay SDK to display the checkout form.
   - Handle success or failure responses.

---

## 📊 **MVP Features List**

- **User Registration/Authentication** ✅
- **Location Detection** ✅
- **Browse Stores (by category, search)** ✅
- **Store Profile (Details)** ✅
- **Favorites (Heart Icon, List)** ✅
- **FavRoutes (Route Saving)** ✅
- **Deep Linking / QR Code** ✅
- **Payment (Razorpay)** ❌

---

## 🔜 **Next Steps**

1. **Test core features** (Favorites, FavRoutes, Store Profile, etc.).
2. **Debug any edge cases** (e.g., location permissions, empty state).
3. **Integrate Razorpay** and test payments flow for ecommerce stores.
4. **Prepare MVP for user testing** and gather feedback.

---
