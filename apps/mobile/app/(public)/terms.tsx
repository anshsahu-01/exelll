import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function TermsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Terms of Service" showBack />
      <ScrollView className="flex-1 p-5 pt-2" contentContainerClassName="pb-10">
        <Text className="mb-6 text-[22px] font-bold text-ink">Terms of Service</Text>
        
        <Text className="mt-4 text-[18px] font-bold text-primary">1. Acceptance of Terms</Text>
        <Text className="mt-2 text-[15px] leading-6 text-muted">
          By accessing and using Exelll, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
        </Text>

        <View className="my-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <Text className="mb-3 text-[18px] font-bold text-ink">2. Important Disclaimers</Text>
          <View className="space-y-2">
            <Text className="text-[15px] font-medium text-ink">• Exelll only connects buyers and sellers.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</Text>
            <Text className="text-[15px] font-medium text-ink">• Users interact at their own risk.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll does not guarantee the identity of buyers or sellers.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll can remove listings and ban accounts.</Text>
          </View>
        </View>

        <Text className="mt-4 text-[18px] font-bold text-primary">3. User Conduct</Text>
        <Text className="mt-2 text-[15px] leading-6 text-muted">
          You agree to use Exelll respectfully and lawfully. Any abusive, fraudulent, or illegal activity will result in immediate account termination.
        </Text>

        <Text className="mt-6 text-[18px] font-bold text-primary">4. Right to Remove Content</Text>
        <Text className="mt-2 text-[15px] leading-6 text-muted">
          Exelll reserves the right to remove any listings or ban any accounts at our sole discretion, without prior notice, if they violate our policies or are deemed inappropriate.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
