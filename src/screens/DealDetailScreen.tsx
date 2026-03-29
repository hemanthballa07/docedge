import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockDeals } from '../data/mockDeals';
import { useTrackingStore } from '../store/useTrackingStore';
import { TrackingStatus } from '../types';
import { FeedStackParamList } from '../navigation/RootNavigator';

type DetailRouteProp = RouteProp<FeedStackParamList, 'DealDetail'>;

const STATUS_OPTIONS: { label: string; value: TrackingStatus }[] = [
  { label: '🔖 Saved', value: 'saved' },
  { label: '📝 Applied', value: 'applied' },
  { label: '✅ Completed', value: 'completed' },
];

export const DealDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const { dealId } = route.params;
  const deal = mockDeals.find(d => d.id === dealId);
  const { trackDeal, untrackDeal, getTrackedDeal } = useTrackingStore();
  const [modalVisible, setModalVisible] = useState(false);

  if (!deal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Deal not found.</Text>
      </SafeAreaView>
    );
  }

  const tracked = getTrackedDeal(dealId);

  const handleTrack = (status: TrackingStatus) => {
    trackDeal(dealId, status);
    setModalVisible(false);
  };

  const handleUntrack = () => {
    Alert.alert('Remove Deal', 'Remove this deal from your tracking list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => untrackDeal(dealId),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.bankRow}>
          <Text style={styles.bank}>{deal.bank}</Text>
          {deal.deadline && (
            <View style={styles.deadlineBadge}>
              <Text style={styles.deadlineText}>Deadline: {deal.deadline}</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{deal.title}</Text>
        <View style={styles.payoutCard}>
          <Text style={styles.payoutLabel}>Payout</Text>
          <Text style={styles.payoutValue}>${deal.payout.toLocaleString()}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>{deal.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {deal.requirements.map((req, i) => (
            <View key={i} style={styles.requirementRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>
        {deal.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>📌 Notes</Text>
            <Text style={styles.notesText}>{deal.notes}</Text>
          </View>
        )}
        <View style={styles.tagsRow}>
          {deal.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {tracked ? (
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.changeStatusBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.changeStatusText}>
                Status: {tracked.status.charAt(0).toUpperCase() + tracked.status.slice(1)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeBtn} onPress={handleUntrack}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.trackBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.trackBtnText}>+ Save / Track Deal</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Set Status</Text>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.modalOption,
                  tracked?.status === opt.value && styles.modalOptionActive,
                ]}
                onPress={() => handleTrack(opt.value)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    tracked?.status === opt.value && styles.modalOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bank: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deadlineBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deadlineText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 28,
  },
  payoutCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutLabel: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
  },
  payoutValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10B981',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  requirementRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 8,
  },
  bullet: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  notesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  trackBtn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  changeStatusBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  changeStatusText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  removeBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalOptionActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOptionTextActive: {
    color: '#FFFFFF',
  },
  modalCancel: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});
