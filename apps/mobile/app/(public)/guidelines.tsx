import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function GuidelinesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Community Guidelines" showBack />
      <ScrollView className="flex-1 p-5 pt-2" contentContainerClassName="pb-10">
        <Text className="mb-6 text-[22px] font-bold text-ink">Safety Guidelines</Text>
        
        <View className="mb-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <Text className="mb-3 text-[18px] font-bold text-ink">Core Disclaimers</Text>
          <View className="space-y-2">
            <Text className="text-[15px] font-medium text-ink">• Exelll only connects buyers and sellers.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</Text>
            <Text className="text-[15px] font-medium text-ink">• Users interact at their own risk.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll does not guarantee the identity of buyers or sellers.</Text>
            <Text className="text-[15px] font-medium text-ink">• Exelll can remove listings and ban accounts.</Text>
          </View>
        </View>

        <Text className="mt-4 text-[18px] font-bold text-primary">Meeting Up</Text>
        <View className="mt-2 space-y-2">
          <Text className="text-[15px] leading-6 text-muted">• Always meet in well-lit, public places, preferably during daylight hours.</Text>
          <Text className="text-[15px] leading-6 text-muted">• Consider meeting on campus or at a designated safe exchange zone (like a police station).</Text>
          <Text className="text-[15px] leading-6 text-muted">• Tell a friend or roommate where you are going and who you are meeting.</Text>
          <Text className="text-[15px] leading-6 text-muted">• Never go to a stranger's dorm room or house alone.</Text>
        </View>

        <Text className="mt-6 text-[18px] font-bold text-primary">Payments</Text>
        <View className="mt-2 space-y-2">
          <Text className="text-[15px] leading-6 text-muted">• Exelll does not process payments. All payments are handled directly between users.</Text>
          <Text className="text-[15px] leading-6 text-muted">• Inspect the item thoroughly before handing over money.</Text>
          <Text className="text-[15px] leading-6 text-muted">• If an offer seems too good to be true, it probably is.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
