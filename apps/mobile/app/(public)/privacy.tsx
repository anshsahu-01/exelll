import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Privacy Policy" showBack />
      <ScrollView className="flex-1 p-5 pt-2" contentContainerClassName="pb-10">
        <Text className="mb-6 text-[22px] font-bold text-ink">Privacy Policy</Text>
        
        <Text className="mt-4 text-[18px] font-bold text-primary">1. Information We Collect</Text>
        <Text className="mt-2 text-[15px] leading-6 text-muted">
          We collect information you provide directly to us, such as when you create or modify your account, list items, or contact support. This includes your name, email, college affiliation, and profile image.
        </Text>

        <Text className="mt-6 text-[18px] font-bold text-primary">2. How We Use Information</Text>
        <Text className="mt-2 text-[15px] leading-6 text-muted">
          We use the information to maintain our marketplace, connect buyers and sellers, and monitor for prohibited activities.
        </Text>

        <View className="my-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <Text className="mb-3 text-[18px] font-bold text-ink">3. Disclaimer of Liability</Text>
          <View className="space-y-2">
            <Text className="text-[15px] font-medium text-ink">• Exelll only connects buyers and sellers.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</Text>
            <Text className="text-[15px] font-medium text-ink">• Users interact at their own risk.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll does not guarantee the identity of buyers or sellers.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll can remove listings and ban accounts.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
