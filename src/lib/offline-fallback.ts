/**
 * Offline Fallback Service
 * Provides fallback functionality when Supabase connection fails
 */

import { User } from "@supabase/supabase-js";

// Store for offline data
const offlineStore = {
  user: null as User | null,
  profiles: [] as any[],
  transactions: [] as any[],
  services: [] as any[],
  orders: [] as any[],
};

// Load data from localStorage
const loadOfflineData = () => {
  try {
    const storedUser = localStorage.getItem("offline_user");
    if (storedUser) offlineStore.user = JSON.parse(storedUser);

    const storedProfiles = localStorage.getItem("offline_profiles");
    if (storedProfiles) offlineStore.profiles = JSON.parse(storedProfiles);

    const storedTransactions = localStorage.getItem("offline_transactions");
    if (storedTransactions)
      offlineStore.transactions = JSON.parse(storedTransactions);

    const storedServices = localStorage.getItem("offline_services");
    if (storedServices) offlineStore.services = JSON.parse(storedServices);

    const storedOrders = localStorage.getItem("offline_orders");
    if (storedOrders) offlineStore.orders = JSON.parse(storedOrders);
  } catch (error) {
    console.error("Error loading offline data:", error);
  }
};

// Save data to localStorage
const saveOfflineData = () => {
  try {
    if (offlineStore.user)
      localStorage.setItem("offline_user", JSON.stringify(offlineStore.user));
    if (offlineStore.profiles.length)
      localStorage.setItem(
        "offline_profiles",
        JSON.stringify(offlineStore.profiles),
      );
    if (offlineStore.transactions.length)
      localStorage.setItem(
        "offline_transactions",
        JSON.stringify(offlineStore.transactions),
      );
    if (offlineStore.services.length)
      localStorage.setItem(
        "offline_services",
        JSON.stringify(offlineStore.services),
      );
    if (offlineStore.orders.length)
      localStorage.setItem(
        "offline_orders",
        JSON.stringify(offlineStore.orders),
      );
  } catch (error) {
    console.error("Error saving offline data:", error);
  }
};

// Initialize with demo data if needed
const initializeDemoData = () => {
  // Only initialize if no data exists
  if (offlineStore.profiles.length === 0) {
    // Create demo user
    offlineStore.user = {
      id: "offline-user-1",
      email: "demo@follboost.com",
      user_metadata: { full_name: "مستخدم تجريبي" },
    } as User;

    // Create demo profile
    offlineStore.profiles = [
      {
        id: "offline-user-1",
        full_name: "مستخدم تجريبي",
        email: "demo@follboost.com",
        balance: 500,
        role: "user",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ];

    // Create demo transactions
    offlineStore.transactions = [
      {
        id: "tx-1",
        user_id: "offline-user-1",
        amount: 100,
        type: "credit",
        payment_method: "bank_transfer",
        status: "completed",
        created_at: new Date().toISOString(),
      },
      {
        id: "tx-2",
        user_id: "offline-user-1",
        amount: 50,
        type: "debit",
        payment_method: "order",
        status: "completed",
        created_at: new Date().toISOString(),
      },
    ];

    // Create demo services
    offlineStore.services = [
      {
        id: "svc-1",
        name: "متابعين انستغرام",
        price: 10,
        min_order: 100,
        max_order: 10000,
        category: "متابعين",
        platform: "انستغرام",
      },
      {
        id: "svc-2",
        name: "إعجابات فيسبوك",
        price: 5,
        min_order: 50,
        max_order: 5000,
        category: "إعجابات",
        platform: "فيسبوك",
      },
    ];

    // Create demo orders
    offlineStore.orders = [
      {
        id: "ord-1",
        user_id: "offline-user-1",
        service_id: "svc-1",
        quantity: 500,
        amount: 50,
        status: "completed",
        created_at: new Date().toISOString(),
      },
    ];

    // Save to localStorage
    saveOfflineData();
  }
};

// Offline auth functions
const offlineAuth = {
  getUser: () => offlineStore.user,
  signIn: (email: string, password: string) => {
    // For demo, accept any credentials
    if (email && password) {
      return {
        user: offlineStore.user,
        session: { access_token: "offline-token" },
      };
    }
    throw new Error("Invalid credentials");
  },
  signOut: () => {
    // Clear user but keep other data
    offlineStore.user = null;
    localStorage.removeItem("offline_user");
    return { error: null };
  },
};

// Offline database functions
const offlineDatabase = {
  getProfile: (userId: string) => {
    return offlineStore.profiles.find((p) => p.id === userId) || null;
  },
  getProfiles: () => offlineStore.profiles,
  getTransactions: (userId: string) => {
    return offlineStore.transactions.filter((t) => t.user_id === userId);
  },
  getServices: () => offlineStore.services,
  getOrders: (userId: string) => {
    return offlineStore.orders.filter((o) => o.user_id === userId);
  },
  addTransaction: (transaction: any) => {
    transaction.id = `tx-${Date.now()}`;
    transaction.created_at = new Date().toISOString();
    offlineStore.transactions.push(transaction);
    saveOfflineData();
    return transaction;
  },
  addOrder: (order: any) => {
    order.id = `ord-${Date.now()}`;
    order.created_at = new Date().toISOString();
    offlineStore.orders.push(order);
    saveOfflineData();
    return order;
  },
  updateProfile: (userId: string, updates: any) => {
    const profile = offlineStore.profiles.find((p) => p.id === userId);
    if (profile) {
      Object.assign(profile, updates);
      saveOfflineData();
    }
    return profile;
  },
};

// Initialize the offline mode
const initOfflineMode = () => {
  console.log("Initializing offline mode...");
  loadOfflineData();
  initializeDemoData();
  return {
    auth: offlineAuth,
    db: offlineDatabase,
    isOffline: true,
  };
};

export const offlineFallback = {
  initOfflineMode,
};
