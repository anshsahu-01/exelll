import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";

import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ScreenHeader } from "@/components/ScreenHeader";

import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { setStoredUser, setToken } from "@/utils/storage";

export default function CompleteProfileScreen() {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useClerkAuth();

  const [collegeName, setCollegeName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleComplete = async () => {
    if (!isLoaded || loading) return;

    if (!collegeName.trim()) {
      setError("Please enter your college name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!clerkUser) {
        throw new Error("You must be logged in to complete your profile.");
      }

      await clerkUser.update({
        unsafeMetadata: {
          ...clerkUser.unsafeMetadata,
          collegeName: collegeName.trim(),
        },
      });

      await syncLocalSession();

      router.replace("/(tabs)");
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.message ||
        err?.message ||
        "Could not update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Complete Profile" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="rounded-2xl border border-line bg-white p-5">
            <View className="mb-6">
              <BrandMark subtitle="Welcome to Exelll" size={350} />
            </View>

            <Text className="mb-1 text-[24px] font-semibold text-ink">
              One last step
            </Text>

            <Text className="mb-5 text-[15px] text-muted">
              Please let us know your college to complete your account setup.
            </Text>

            <View className="mb-4">
              <Input
                label="College Name"
                value={collegeName}
                onChangeText={setCollegeName}
                placeholder="e.g. Stanford University"
              />

              {error ? (
                <Text className="mb-3 text-[13px] text-danger">
                  {error}
                </Text>
              ) : null}

              <Button
                title="Continue"
                onPress={handleComplete}
                loading={loading}
                className="rounded-2xl mt-2"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
