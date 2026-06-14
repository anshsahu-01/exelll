import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Privacy Policy" showBack />
      <ScrollView contentContainerClassName="p-5 pb-10">
        <Text className="mb-4 text-sm font-semibold text-ink">Last Updated: {new Date().toLocaleDateString()}</Text>
        
        <Text className="mb-2 mt-4 text-lg font-bold text-ink">1. Information We Collect</Text>
        <Text className="text-sm text-muted">We collect information you provide directly to us, such as when you create or modify your account, list items, or contact support. This includes your name, email, college affiliation, and profile image.</Text>

        <Text className="mb-2 mt-4 text-lg font-bold text-ink">2. How We Use Information</Text>
        <Text className="text-sm text-muted">We use the information to maintain our marketplace, connect buyers and sellers, and monitor for prohibited activities.</Text>

        <View className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <Text className="mb-2 text-lg font-bold text-ink">3. Disclaimer of Liability</Text>
          <Text className="text-sm font-medium text-ink">• Exelll only connects buyers and sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</Text>
          <Text className="text-sm font-medium text-ink">• Users interact at their own risk.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll does not guarantee the identity of buyers or sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exelll can remove listings and ban accounts.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
