import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DealCard } from '../components/DealCard';
import { mockDeals } from '../data/mockDeals';
import { useTrackingStore } from '../store/useTrackingStore';
import { Deal, DealTag } from '../types';
import { FeedStackParamList } from '../navigation/RootNavigator';

type FeedNavProp = NativeStackNavigationProp<FeedStackParamList, 'FeedList'>;

const ALL_TAGS: DealTag[] = ['bank', 'credit card', 'brokerage', 'savings', 'checking', 'investment'];

export const FeedScreen: React.FC = () => {
  const navigation = useNavigation<FeedNavProp>();
  const { getTrackedDeal } = useTrackingStore();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<DealTag | null>(null);

  const filtered = mockDeals.filter(deal => {
    const matchesSearch =
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.bank.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? deal.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const renderDeal = ({ item }: { item: Deal }) => {
    const tracked = getTrackedDeal(item.id);
    return (
      <DealCard
        deal={item}
        onPress={() => navigation.navigate('DealDetail', { dealId: item.id })}
        trackingStatus={tracked?.status}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>DocEdge</Text>
        <Text style={styles.subheading}>Doctor of Credit Deals</Text>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search deals or banks..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={styles.tagsScrollRow}>
        <TouchableOpacity
          style={[styles.filterTag, selectedTag === null && styles.filterTagActive]}
          onPress={() => setSelectedTag(null)}
        >
          <Text style={[styles.filterTagText, selectedTag === null && styles.filterTagTextActive]}>All</Text>
        </TouchableOpacity>
        {ALL_TAGS.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.filterTag, selectedTag === tag && styles.filterTagActive]}
            onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
          >
            <Text style={[styles.filterTagText, selectedTag === tag && styles.filterTagTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderDeal}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No deals found</Text>
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
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagsScrollRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 8,
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTagActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTagTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
