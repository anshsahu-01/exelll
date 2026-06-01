import React from 'react';
import { LayoutDashboard, ShoppingBag, MessageSquare, DollarSign } from 'lucide-react';

// Simple stats card component – can be enhanced later
function StatCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
      <Icon className="w-6 h-6 text-primary-600 mr-3" />
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function StatsCards() {
  // Placeholder static values – replace with real API data later
  const stats = [
    { icon: LayoutDashboard, title: 'Active Listings', value: 12 },
    { icon: ShoppingBag, title: 'Orders', value: 5 },
    { icon: MessageSquare, title: 'Messages', value: 14 },
    { icon: DollarSign, title: 'Revenue', value: '$1,230' },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((s, i) => (
        <StatCard key={i} icon={s.icon} title={s.title} value={s.value} />
      ))}
    </section>
  );
}
