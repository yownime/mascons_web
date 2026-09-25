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
  tableCellName: { flex: 2.2, fontSize: 9, color: '#111827', fontWeight: 'bold' },
  tableCell: { flex: 1, fontSize: 9, color: '#4b5563', textAlign: 'center', fontWeight: 'bold' },
  tableCellTotal: { flex: 1.2, fontSize: 9, color: '#4f46e5', textAlign: 'center', fontWeight: 'extrabold' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }
});

export const CFITReport = ({ data, user }: { data: any, user: any }) => {
  // Extract scores logic (supporting both mobile reportData and mock breakdown)
  const getScore = (testKey: string, index: number) => {
    if (data && data[testKey] && data[testKey].score) {
      return data[testKey].score.correct || 0;
    }
    if (data && Array.isArray(data.breakdown) && data.breakdown[index]) {
      return data.breakdown[index].correct || 0;
    }
    return 0;
  };

  const test1 = getScore('test_1', 0);
  const test2 = getScore('test_2', 1);
  const test3 = getScore('test_3', 2);
  const test4 = getScore('test_4', 3);
  const test5 = getScore('test_5', 4);
  const test6 = getScore('test_6', 5);
  const test7 = getScore('test_7', 6);
  const test8 = getScore('test_8', 7);
  const totalRawScore = test1 + test2 + test3 + test4 + test5 + test6 + test7 + test8;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Laporan Hasil Tes Individu</Text>
          <Text style={styles.subtitle}>Kategori: CFIT (Culture Fair Intelligence Test) - 8 Subtes</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekapitulasi Hasil Subtes</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellName}>Nama Partisipan</Text>
            <Text style={styles.tableCell}>Part 1{'\n'}(12)</Text>
            <Text style={styles.tableCell}>Part 2{'\n'}(14)</Text>
            <Text style={styles.tableCell}>Part 3{'\n'}(12)</Text>
            <Text style={styles.tableCell}>Part 4{'\n'}(8)</Text>
            <Text style={styles.tableCell}>Part 5{'\n'}(13)</Text>
            <Text style={styles.tableCell}>Part 6{'\n'}(14)</Text>
            <Text style={styles.tableCell}>Part 7{'\n'}(13)</Text>
            <Text style={styles.tableCell}>Part 8{'\n'}(10)</Text>
            <Text style={styles.tableCellTotal}>Total{'\n'}(Max 96)</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{user.fullName}</Text>
            <Text style={styles.tableCell}>{test1}</Text>
            <Text style={styles.tableCell}>{test2}</Text>
            <Text style={styles.tableCell}>{test3}</Text>
            <Text style={styles.tableCell}>{test4}</Text>
            <Text style={styles.tableCell}>{test5}</Text>
            <Text style={styles.tableCell}>{test6}</Text>
            <Text style={styles.tableCell}>{test7}</Text>
            <Text style={styles.tableCell}>{test8}</Text>
            <Text style={styles.tableCellTotal}>{totalRawScore}</Text>
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
