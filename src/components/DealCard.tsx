import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  onPress: () => void;
  trackingStatus?: string;
}

const TAG_COLORS: Record<string, string> = {
  'bank': '#E3F2FD',
  'credit card': '#FCE4EC',
  'brokerage': '#E8F5E9',
  'savings': '#FFF3E0',
  'checking': '#EDE7F6',
  'investment': '#E0F7FA',
};

const TAG_TEXT_COLORS: Record<string, string> = {
  'bank': '#1565C0',
  'credit card': '#C62828',
  'brokerage': '#2E7D32',
  'savings': '#E65100',
  'checking': '#4527A0',
  'investment': '#00695C',
};

const STATUS_COLORS: Record<string, string> = {
  saved: '#FFF9C4',
  applied: '#E3F2FD',
  completed: '#E8F5E9',
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  saved: '#F57F17',
  applied: '#1565C0',
  completed: '#2E7D32',
};

export const DealCard: React.FC<DealCardProps> = ({ deal, onPress, trackingStatus }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.bank}>{deal.bank}</Text>
          <Text style={styles.payout}>${deal.payout.toLocaleString()}</Text>
        </View>
        {trackingStatus && (
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[trackingStatus] }]}>
            <Text style={[styles.statusText, { color: STATUS_TEXT_COLORS[trackingStatus] }]}>
              {trackingStatus.charAt(0).toUpperCase() + trackingStatus.slice(1)}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>{deal.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{deal.description}</Text>
      <View style={styles.tagsRow}>
        {deal.tags.map(tag => (
          <View key={tag} style={[styles.tag, { backgroundColor: TAG_COLORS[tag] || '#F5F5F5' }]}>
            <Text style={[styles.tagText, { color: TAG_TEXT_COLORS[tag] || '#424242' }]}>{tag}</Text>
          </View>
        ))}
        {deal.deadline && (
          <View style={styles.deadlineTag}>
            <Text style={styles.deadlineText}>Due {deal.deadline}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bank: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  payout: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  deadlineTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
  },
  deadlineText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#DC2626',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
