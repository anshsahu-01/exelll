import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useSegments, useRouter, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, ClerkLoaded, useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/tokenCache";
import { LoadingState } from "@/components/LoadingState";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favoritesStore";

import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { clearAuthStorage } from "@/utils/storage";
import { disconnectSocket } from "@/services/socket.service";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Please set it in .env.");
}

function InitialLayout() {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const isRouterReady = !!navigationState?.key;
  
  const [isInitializing, setIsInitializing] = useState(true);

  const hydrateCart = useCartStore((state) => state.hydrate);
  const verifyCartItems = useCartStore((state) => state.verifyItems);
  const setCartOwnerUserId = useCartStore((state) => state.setOwnerUserId);
  const hydrateFavorites = useFavoritesStore((state) => state.hydrate);
  const authUserId = useAuthStore((state) => state.user?.id ?? null);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const isAuthenticated = Boolean(isSignedIn && token && authUserId);

  // Sync session and load user profile
  useEffect(() => {
    if (!isLoaded) return;
    
    let isMounted = true;

    const syncSession = async () => {
      if (isSignedIn) {
        try {
          const clerkToken = await getToken();
          if (clerkToken) {
            useAuthStore.setState({ token: clerkToken });
            try {
              const user = await authService.getMe(clerkToken);
              if (isMounted) {
                const { setStoredUser } = await import("@/utils/storage");
                await setStoredUser(user);
                useAuthStore.setState({ user, isHydrated: true });
              }
            } catch (err) {
              console.error("Error fetching user profile:", err);
              if (isMounted) {
                const { getStoredUser } = await import("@/utils/storage");
                const storedUser = await getStoredUser<any>();
                if (storedUser) {
                  useAuthStore.setState({ user: storedUser, isHydrated: true });
                } else {
                  await signOut();
                  disconnectSocket();
                  await clearAuthStorage();
                  await setCartOwnerUserId(null);
                  useAuthStore.setState({ token: null, user: null, isHydrated: true });
                }
              }
            }
          } else {
            throw new Error("No token available");
          }
        } catch (error) {
          console.error("Error syncing session:", error);
          if (isMounted) {
            await signOut();
            disconnectSocket();
            await clearAuthStorage();
            await setCartOwnerUserId(null);
            useAuthStore.setState({ token: null, user: null, isHydrated: true });
          }
        }
      } else {
        if (isMounted) {
          disconnectSocket();
          await clearAuthStorage();
          await setCartOwnerUserId(null);
          useAuthStore.setState({ token: null, user: null, isHydrated: true });
        }
      }
      
      if (isMounted) {
        setIsInitializing(false);
      }
    };

    syncSession();
    
    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn]);

  // Hydrate local stores on startup
  useEffect(() => {
    hydrateFavorites();
  }, [hydrateFavorites]);

  useEffect(() => {
    if (isInitializing) return;

    const syncCartState = async () => {
      await hydrateCart(authUserId);
      await verifyCartItems();
    };

    syncCartState();
  }, [authUserId, hydrateCart, isInitializing, verifyCartItems]);

  useEffect(() => {
    if (isInitializing || !isRouterReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if signed out and attempting to access app
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main tabs if signed in and attempting to access auth screen
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isInitializing, isRouterReady, segments[0]]);

  if (!isRouterReady || isInitializing) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="product/edit/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="checkout"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="profile/edit-profile"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
