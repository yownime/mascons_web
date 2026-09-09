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
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 5, borderBottomWidth: 1, borderBottomColor: '#d1d5db' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 5, backgroundColor: '#fafafa' },
  tableCellName: { flex: 2, fontSize: 8, color: '#111827', fontWeight: 'bold' },
  tableCell: { flex: 1, fontSize: 8, color: '#4b5563', textAlign: 'center', fontWeight: 'bold' },
  tableCellTotal: { flex: 1.2, fontSize: 8, color: '#4f46e5', textAlign: 'center', fontWeight: 'extrabold' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }
});

export const EPPSReport = ({ data, user }: { data: any, user: any }) => {
  const eppsDimensions = [
    'ACH', 'DEF', 'ORD', 'EXH', 'AUT', 'AFF', 'INT', 'SUC', 
    'DOM', 'ABA', 'NUR', 'CHG', 'END', 'HET', 'AGG'
  ];
  
  const epps_scores = eppsDimensions.map(dim => {
    // First try to get from mobile's exact payload: data.rawScores[dim]
    if (data?.rawScores && data.rawScores[dim] !== undefined) {
      return data.rawScores[dim];
    }
    // Fallback 1: if it's nested in dimensionScores
    if (data?.dimensionScores && data.dimensionScores[dim]) {
      return data.dimensionScores[dim].total || 0;
    }
    // Fallback 2: for the mockData structure
    if (data?.normaResults && data.normaResults[dim] !== undefined) {
      return data.normaResults[dim];
    }
    return 0;
  });

  const epps_consistency = data?.consistency?.consistentPairs || data?.consistencyCheck?.consistentPairs || 0;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Laporan Hasil Tes Individu</Text>
          <Text style={styles.subtitle}>Kategori: Edwards Personal Preference Schedule (EPPS)</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekapitulasi Hasil</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellName}>Nama Partisipan</Text>
            {eppsDimensions.map(dim => (
              <Text key={dim} style={styles.tableCell}>{dim}</Text>
            ))}
            <Text style={styles.tableCellTotal}>Consistency</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{user.fullName}</Text>
            {epps_scores.map((score, i) => (
              <Text key={i} style={styles.tableCell}>{score}</Text>
            ))}
            <Text style={styles.tableCellTotal}>{epps_consistency}</Text>
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
