PRD FOR DUKAAN PE BUYER APP (AKA DUNE)

---

# **DUNE (Buyer App) - Product Requirements Document**

---

## **Overview**

**DUNE** is a mobile platform designed to **simplify buying experiences** by enabling users to **browse and interact** with thousands of stores across India — **all from one single app**.

The user doesn't need to install different apps for different stores. DUNE acts as a **universal app** where users can:

- Discover local + national stores
- Set their location
- Visit a store virtually
- Shop, order, book appointments, or explore based on the store’s type.

**The app transforms itself into the store's own experience** — whether it’s a grocery store, restaurant, service business, or a product brand.

---

## **Goals**

- Create an all-in-one **platform** for buyers to interact with multiple stores easily.
- Allow stores to have their own **virtual storefront** within the app without needing to build apps themselves.
- **Distraction-free**, **fast** and **seamless** store discovery and interaction.
- Eliminate the need for buyers to install multiple apps and fill in their details everywhere.

---

## **Key Features**

### 1. **Authentication**

- **Sign Up / Login**
  - Via Phone Number (OTP based)
  - Via Google Sign-In
  - Via Apple Sign-In (for iOS)
- **Session Persistence**
  - Auto login unless user logs out.

### 2. **Location Management**

- Onboarding includes:
  - **Auto-detect** user’s location via GPS (Google Location API)
  - **Manual search** for a location (Google Places API)
  - **Select** from previously saved locations
- **Saved Locations** feature to quickly switch.

### 3. **Platform Home (Marketplace)**

- After location setup, users land on the **Platform Home**.
- Users can:
  - Browse **stores nearby** + **pan-India brands**
  - **Search** for a specific store, brand, or category
  - Filter by **categories** (e.g., Grocery, Restaurants, Services, Electronics)
  - See **suggested stores** based on location and interests
  - **Favorite** stores for quick access later.

#### Store Listing Cards Include:

- Store Name
- Store Logo / Image
- Store Category
- Average Rating
- Distance (if local)
- Badges (like Featured, New)

### 4. **Store Detail Page**

When the user clicks on a store, they see:

- **Basic Details**
  - Store Name
  - Category
  - Store Logo/Banner
- **Contact Information**
  - Address
  - Open/Close Timings
  - Call Store (Phone link)
  - Get Directions (Google Maps integration)
- **Ratings and Reviews**
  - Average Rating
  - Customer Reviews
- **Facilities Available**
  - Parking, Home Delivery, Pet Friendly, etc.
- **Gallery**
  - Images/Videos of store
- **About Section**

  - Description and specialities.

- **Option to "Visit Store" Virtually**

---

### 5. **Visit Store Virtually**

When a user clicks "Visit Store", the app **morphs** into that store’s digital storefront:

The type of experience depends on store type:

| Store Type                       | Experience                                       |
| -------------------------------- | ------------------------------------------------ |
| Product-based (Grocery, Retail)  | E-commerce (browse and buy products)             |
| Restaurants (QSR)                | Food Ordering Interface (Menu → Cart → Checkout) |
| Restaurants (Fine Dining)        | Table Booking System (Book a Table)              |
| Service Providers (Salons, Gyms) | Appointment Booking System                       |
| Informational Business           | Infomercial/Showcase Mode (Gallery, Info only)   |

**Store Apps are opened via:**

- Direct Link
- QR Code Scan
- Platform Browsing

---

### 6. **QR Code & Deep Link**

- Each store will have a unique QR Code and Link.
- Scanning the QR or clicking the link directly opens that store’s storefront inside the DUNE app.

---

### 7. **Favorites Management**

- Users can **favorite** stores.
- Favorites can be accessed from a dedicated screen.

---

### 8. **Notifications (Future Phase)**

- Order updates
- Promotions and Offers
- Store Updates

---

### 9. **Performance & UX**

- Smooth, native-feeling animations and transitions.
- Optimized for low-end Android and iOS devices.
- Offline caching using **TanStack Query**.
- Minimal loading times.

---

## **User Journey Example**

1. **User opens DUNE App**
2. **Signs Up** using mobile number or Google
3. **Sets Location** (auto-detect / search / saved address)
4. **Lands on Home Page**
5. **Browses** or **searches** for a store
6. **Clicks on a Store** → Sees Store Details
7. **Clicks "Visit Store"** → App transforms into store app
8. **Shops, Orders, Books, or Views** as per store type
9. **Completes transaction** (Future Phase: integrated payments)
10. **Returns to platform** to browse more stores

---

## **Technical Architecture**

### **Frontend:**

- React Native + Expo
- Nativewind (TailwindCSS for React Native)
- Zustand (for state management)
- React Query / Tanstack Query (for server data)
- Google API (for location services)
- React Navigation (for routing and navigation)
- Expo Router (for routing and navigation)
- Expo Location (for location services)
- TypeScript (for type safety and better code quality)
- Razorpay (for payments, integrated)

### **Backend (Expected APIs Needed):**

- Authentication APIs
- Location APIs
- Store Listing APIs
- Store Detail APIs
- QR Code & Deep Link APIs
- Favorites APIs
- Order/Booking APIs (depending on store type)

---

## **MVP Scope**

- Authentication
- Location Setup
- Platform Home (Store listing and search)
- Store Details Page
- Visit Store Virtually (Basic store storefront experiences)
- QR Code Scan
- Favorites Management

---

## **Stretch Goals (Phase 2)**

- Push Notifications
- Personalized Recommendations
- Loyalty Program / Rewards
- Integrated Payment Gateway

---

# **Summary in One Line**

**DUNE** = _Shopify for mobile apps + marketplaces — a single buyer app for visiting any store in India without installing multiple apps._

---

✅  
This PRD is detailed enough for an AI agent, a developer, or anyone to get a very solid idea of the entire DUNE Buyer App.

---
