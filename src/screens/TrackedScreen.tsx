import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DealCard } from '../components/DealCard';
import { mockDeals } from '../data/mockDeals';
import { useTrackingStore } from '../store/useTrackingStore';
import { TrackedDeal, TrackingStatus } from '../types';
import { TrackedStackParamList } from '../navigation/RootNavigator';

type TrackedNavProp = NativeStackNavigationProp<TrackedStackParamList, 'TrackedList'>;

const FILTERS: { label: string; value: TrackingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🔖 Saved', value: 'saved' },
  { label: '📝 Applied', value: 'applied' },
  { label: '✅ Completed', value: 'completed' },
];

export const TrackedScreen: React.FC = () => {
  const navigation = useNavigation<TrackedNavProp>();
  const { trackedDeals } = useTrackingStore();
  const [filter, setFilter] = useState<TrackingStatus | 'all'>('all');

  const filtered = trackedDeals.filter(t => filter === 'all' || t.status === filter);

  const renderItem = ({ item }: { item: TrackedDeal }) => {
    const deal = mockDeals.find(d => d.id === item.dealId);
    if (!deal) return null;
    return (
      <DealCard
        deal={deal}
        onPress={() => navigation.navigate('TrackedDetail', { dealId: deal.id })}
        trackingStatus={item.status}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Tracked</Text>
        <Text style={styles.subheading}>{trackedDeals.length} deal{trackedDeals.length !== 1 ? 's' : ''} tracked</Text>
      </View>
      <View style={styles.filtersRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterBtn, filter === f.value && styles.filterBtnActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterBtnText, filter === f.value && styles.filterBtnTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.dealId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No deals tracked yet</Text>
            <Text style={styles.emptyText}>
              Go to the Feed tab and save deals you want to track.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterBtnActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterBtnText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
