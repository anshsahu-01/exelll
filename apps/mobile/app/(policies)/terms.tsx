import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function TermsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Terms of Service" showBack />
      <ScrollView contentContainerClassName="p-5 pb-10">
        <Text className="mb-4 text-sm font-semibold text-ink">Last Updated: {new Date().toLocaleDateString()}</Text>
        
        <Text className="mb-2 mt-4 text-lg font-bold text-ink">1. Acceptance of Terms</Text>
        <Text className="text-sm text-muted">By accessing and using Exelll, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</Text>

        <View className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <Text className="mb-2 text-lg font-bold text-ink">2. Important Disclaimers</Text>
          <Text className="text-sm font-medium text-ink">• Exelll only connects buyers and sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</Text>
          <Text className="text-sm font-medium text-ink">• Users interact at their own risk.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll does not guarantee the identity of buyers or sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll can remove listings and ban accounts.</Text>
        </View>

        <Text className="mb-2 mt-4 text-lg font-bold text-ink">3. User Conduct</Text>
        <Text className="text-sm text-muted">You agree to use Exelll respectfully and lawfully. Any abusive, fraudulent, or illegal activity will result in immediate account termination.</Text>

        <Text className="mb-2 mt-4 text-lg font-bold text-ink">4. Right to Remove Content</Text>
        <Text className="text-sm text-muted">Exelll reserves the right to remove any listings or ban any accounts at our sole discretion, without prior notice, if they violate our policies or are deemed inappropriate.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
