import { useState, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUp, useAuth as useClerkAuth, useUser, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";

import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";
import { GoogleLogo } from "@/components/GoogleLogo";
import { Input } from "@/components/Input";
import { ScreenHeader } from "@/components/ScreenHeader";

import * as authService from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { setStoredUser, setToken } from "@/utils/storage";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const { signUp, isLoaded } = useSignUp();
  const { getToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const syncLocalSession = async () => {
    await clerkUser?.reload();
    const token = await getToken();
    if (!token) throw new Error("Could not restore session");
    const user = await authService.getMe(token);
    await setToken(token);
    await setStoredUser(user);
    useAuthStore.setState({ token, user, isHydrated: true });
  };

  const handleGoogleOAuth = useCallback(async () => {
    if (!termsAccepted) {
      setError("You must accept the Terms & Conditions, Privacy Policy and Community Guidelines.");
      return;
    }

    try {
      setGoogleLoading(true);
      setError("");

      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)", { scheme: "exelll" }),
      });

      if (createdSessionId) {
        await setOAuthActive!({ session: createdSessionId });
        await clerkUser?.reload();
        
        const metadata = clerkUser?.unsafeMetadata || {};
        if (!metadata.collegeName) {
          router.replace("/(auth)/complete-profile");
          return;
        }

        await syncLocalSession();
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      if (err.message && err.message.includes("canceled")) return;
      setError(err.errors?.[0]?.message || err.message || "Google Sign-Up failed");
    } finally {
      setGoogleLoading(false);
    }
  }, [startOAuthFlow, clerkUser, termsAccepted]);

  const handleRegister = async () => {
    if (!isLoaded || loading || googleLoading) return;

    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Fill all fields. Password must be 6+ characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms & Conditions, Privacy Policy and Community Guidelines.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await signUp.create({
        emailAddress: email.trim().toLowerCase(),
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          collegeName: collegeName.trim() || undefined,
          termsAccepted: true,
          termsAcceptedAt: new Date().toISOString(),
          policyVersion: "1.0",
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      router.push({
        pathname: "/(auth)/verify-email",
        params: { email: email.trim().toLowerCase() },
      });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Create account" showBack />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="p-5 pt-3 flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <View className="rounded-2xl border border-line bg-white p-5">
            <View className="mb-5">
              <BrandMark subtitle="Join your campus marketplace" size={350}/>
            </View>
            <Text className="mb-1 text-[20px] font-semibold text-ink">Set up your profile</Text>
            <Text className="mb-5 text-[15px] text-muted">Create an account to get started</Text>

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

              <Input label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@college.edu"
              />
              <Input
                label="College"
                value={collegeName}
                onChangeText={setCollegeName}
                placeholder="College name (optional)"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Min 8 characters"
              />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Re-enter password"
              />
            </View>

            <View className="mb-4 mt-2 flex-row items-start">
              <Pressable
                onPress={() => setTermsAccepted(!termsAccepted)}
                hitSlop={8}
                style={{
                  marginRight: 10,
                  marginTop: 2,
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: termsAccepted ? "#111111" : "#CCCCCC",
                  backgroundColor: termsAccepted ? "#111111" : "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {termsAccepted && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </Pressable>
              <Text className="text-[13px] text-muted flex-1 leading-5">
                I agree to the <Text className="text-primary font-medium" onPress={() => router.push('/(public)/terms' as any)}>Terms & Conditions</Text>, <Text className="text-primary font-medium" onPress={() => router.push('/(public)/privacy' as any)}>Privacy Policy</Text> and <Text className="text-primary font-medium" onPress={() => router.push('/(public)/guidelines' as any)}>Community Guidelines</Text>
              </Text>
            </View>

            {error ? <Text className="mb-3 text-[13px] text-danger">{error}</Text> : null}
            <Button 
              title="Sign up" 
              onPress={handleRegister} 
              loading={loading} 
              disabled={!name.trim() || !email.trim() || password.length < 6 || password !== confirmPassword || !termsAccepted}
              className="rounded-2xl mb-4" 
            />

            <Pressable
              onPress={() =>
                router.push("/(auth)/login")
              }
            >
              <Text className="text-center text-[15px] text-muted">
                Already have an account?{" "}
                <Text className="font-medium text-ink">
                  Log in
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
