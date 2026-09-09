import React from 'react';
// @ts-ignore
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { marginBottom: 30, borderBottom: 2, borderBottomColor: '#4f46e5', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b' },
  subtitle: { fontSize: 12, color: '#4b5563', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#4f46e5', textTransform: 'uppercase' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 8, backgroundColor: '#fafafa' },
  tableCellName: { flex: 2, fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableCellTotal: { flex: 1, fontSize: 10, color: '#4f46e5', textAlign: 'center', fontWeight: 'extrabold' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }
});

export const InteligensiUmumReport = ({ data, user }: { data: any, user: any }) => {
  let correct = 0;
  
  if (data && data.score) {
    correct = data.score.correct || 0;
  }

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Laporan Hasil Tes Individu</Text>
          <Text style={styles.subtitle}>Kategori: TIU (Tes Inteligensi Umum)</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekapitulasi Hasil</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellName}>Nama Partisipan</Text>
            <Text style={styles.tableCellTotal}>Total Raw Score</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{user.fullName}</Text>
            <Text style={styles.tableCellTotal}>{correct}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Laporan ini dicetak secara otomatis oleh Sistem Mascons. 
          Rahasia dan hanya untuk pihak yang berkepentingan.
        </Text>
      </Page>
    </Document>
  );
};
