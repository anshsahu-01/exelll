import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function SafetyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Safety Guidelines" showBack />
      <ScrollView contentContainerClassName="p-5 pb-10">
        <View className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <Text className="mb-2 text-lg font-bold text-ink">Core Disclaimers</Text>
          <Text className="text-sm font-medium text-ink">• Exelll only connects buyers and sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</Text>
          <Text className="text-sm font-medium text-ink">• Users interact at their own risk.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll does not guarantee the identity of buyers or sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll can remove listings and ban accounts.</Text>
        </View>

        <Text className="mb-2 mt-4 text-lg font-bold text-ink">Meeting Up</Text>
        <Text className="mb-1 text-sm text-muted">• Always meet in well-lit, public places, preferably during daylight hours.</Text>
        <Text className="mb-1 text-sm text-muted">• Consider meeting on campus or at a designated safe exchange zone.</Text>
        <Text className="mb-1 text-sm text-muted">• Tell a friend or roommate where you are going and who you are meeting.</Text>
        <Text className="text-sm text-muted">• Never go to a stranger's dorm room or house alone.</Text>

        <Text className="mb-2 mt-6 text-lg font-bold text-ink">Payments</Text>
        <Text className="mb-1 text-sm text-muted">• Exelll does not process payments. All payments are handled directly between users.</Text>
        <Text className="mb-1 text-sm text-muted">• Inspect the item thoroughly before handing over money.</Text>
        <Text className="text-sm text-muted">• If an offer seems too good to be true, it probably is.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
