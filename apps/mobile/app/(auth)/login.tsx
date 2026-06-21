import { useState, useCallback } from "react";
import {
  Platform,
  Text,
  View,
  Pressable,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth as useClerkAuth, useSignIn, useUser, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { GoogleLogo } from "@/components/GoogleLogo";
import { Input } from "@/components/Input";

import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { setStoredUser, setToken } from "@/utils/storage";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { getToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const syncLocalSession = async () => {
    await clerkUser?.reload();

    const token = await getToken();

    if (!token) {
      throw new Error("Could not restore session");
    }

    const user = await authService.getMe(token);

    await setToken(token);
    await setStoredUser(user);

    useAuthStore.setState({
      token,
      user,
      isHydrated: true,
    });
  };

  const handleGoogleOAuth = useCallback(async () => {
    try {
      setGoogleLoading(true);
      setError("");

      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)", { scheme: "exelll" }),
      });

      if (createdSessionId) {
        await setOAuthActive!({ session: createdSessionId });
        await clerkUser?.reload();
        
        // Ensure collegeName exists
        const metadata = clerkUser?.unsafeMetadata || {};
        if (!metadata.collegeName) {
          router.replace("/(auth)/complete-profile");
          return;
        }

        await syncLocalSession();
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      if (err.message && err.message.includes("canceled")) {
        // user canceled
        return;
      }
      setError(err.errors?.[0]?.message || err.message || "Google Sign-In failed");
    } finally {
      setGoogleLoading(false);
    }
  }, [startOAuthFlow, clerkUser]);

  const handleLogin = async () => {
    if (!isLoaded || loading || googleLoading) return;

    if (!email.trim() || !password.trim()) {
      setError("Enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      useAuthStore.setState({
        isHydrated: false,
      });

      const result = await signIn.create({
        identifier: email.trim().toLowerCase(),
        password,
      });

      // ONLY allow fully completed login
      if (result.status !== "complete") {
        useAuthStore.setState({
          isHydrated: true,
        });

        setError(
          "Login could not complete. Please reset your password once from Clerk dashboard or create a new account."
        );

        return;
      }

      if (!result.createdSessionId) {
        throw new Error("Session creation failed");
      }

      await setActive({
        session: result.createdSessionId,
      });

      await syncLocalSession();

      router.replace("/(tabs)");
    } catch (err: any) {
      useAuthStore.setState({
        isHydrated: true,
      });

      const clerkMessage =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Login failed";

      setError(clerkMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 64, paddingBottom: 40 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
          <View className="rounded-2xl border border-line bg-white p-5">
            <View className="mb-6">
              <BrandMark
                subtitle="Buy and sell on your campus"
                size={350}
              />
            </View>

            <Text className="mb-3 text-[34px] font-bold text-ink text-center">
              Welcome back
            </Text>

            <Text className="mb-12 text-[15px] text-muted text-center">
              Log in to continue
            </Text>

            <View className="mb-4">
              <Button
                title="Continue with Google"
                onPress={handleGoogleOAuth}
                loading={googleLoading}
                className="mb-4 rounded-2xl bg-white border border-line"
                textClassName="text-ink font-semibold"
                icon={<GoogleLogo size={20} />}
              />
              <View className="mb-4 flex-row items-center">
                <View className="flex-1 h-[1px] bg-line" />
                <Text className="mx-3 text-[13px] text-muted font-medium">OR</Text>
                <View className="flex-1 h-[1px] bg-line" />
              </View>

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@college.edu"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Your password"
              />

              <Pressable
                onPress={() =>
                  router.push("/(auth)/forgot-password")
                }
                className="self-end mb-4"
              >
                <Text className="text-[14px] font-medium text-ink">
                  Forgot password?
                </Text>
              </Pressable>

              {error ? (
                <Text className="mb-3 text-[13px] text-danger">
                  {error}
                </Text>
              ) : null}

              <Button
                title="Log in"
                onPress={handleLogin}
                loading={loading}
                disabled={!email.trim() || !password.trim()}
                className="rounded-2xl"
              />
            </View>

            <Pressable
              onPress={() =>
                router.push("/(auth)/register")
              }
            >
              <Text className="text-center text-[15px] text-muted">
                New here?{" "}
                <Text className="font-medium text-ink">
                  Create account
                </Text>
              </Text>
            </Pressable>
          </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}