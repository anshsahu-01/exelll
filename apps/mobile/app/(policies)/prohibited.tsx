import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function ProhibitedItemsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Prohibited Items" showBack />
      <ScrollView contentContainerClassName="p-5 pb-10">
        <Text className="mb-6 text-sm text-muted">The following items are strictly prohibited on Exell. Listing any of these items will result in immediate removal of the listing and potential account ban.</Text>

        <Text className="mb-2 text-lg font-bold text-ink">List of Prohibited Items</Text>
        <Text className="text-sm font-medium text-ink">• Drugs</Text>
        <Text className="text-sm font-medium text-ink">• Alcohol</Text>
        <Text className="text-sm font-medium text-ink">• Tobacco / Vapes</Text>
        <Text className="text-sm font-medium text-ink">• Weapons</Text>
        <Text className="text-sm font-medium text-ink">• Prescription medicines</Text>
        <Text className="text-sm font-medium text-ink">• Fake IDs</Text>
        <Text className="text-sm font-medium text-ink">• Stolen goods</Text>
        <Text className="text-sm font-medium text-ink">• Counterfeit products</Text>
        <Text className="text-sm font-medium text-ink">• Adult content</Text>
        <Text className="text-sm font-medium text-ink">• Pirated software</Text>
        <Text className="mb-6 text-sm font-medium text-ink">• Any illegal item under Indian law</Text>

        <View className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <Text className="mb-2 text-lg font-bold text-ink">Important Disclaimers</Text>
          <Text className="text-sm font-medium text-ink">• Exell only connects buyers and sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exell is not responsible for transactions, payments, deliveries, meetings, disputes, fraud, injuries, theft, or damages.</Text>
          <Text className="text-sm font-medium text-ink">• Users interact at their own risk.</Text>
          <Text className="text-sm font-medium text-ink">• Exell does not guarantee the identity of buyers or sellers.</Text>
          <Text className="text-sm font-medium text-ink">• Exell can remove listings and ban accounts.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
