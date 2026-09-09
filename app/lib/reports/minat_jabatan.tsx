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
  tableCellTitle: { flex: 2, fontSize: 8, color: '#111827', fontWeight: 'bold' },
  tableCell: { flex: 1, fontSize: 8, color: '#4b5563', textAlign: 'center', fontWeight: 'bold' },
  tableCellCategory: { fontSize: 6, textAlign: 'center', marginTop: 2, color: '#6b7280' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }
});

export const MinatJabatanReport = ({ data, user }: { data: any, user: any }) => {
  const resultData = data?.bagian_1?.result;
    
  const getBidang = (key: string) => {
      return {
          score: resultData?.bidangMinatScore?.[key] || 0,
          category: resultData?.bidangMinatKategori?.[key] || '-',
      }
  };
  
  const getTipe = (key: string) => {
      return {
          score: resultData?.tipeMinatScore?.[key] || 0,
          category: resultData?.tipeMinatKategori?.[key] || '-',
      }
  };
  
  const tingkat = {
      score: resultData?.tingkatMinatScore?.['Total'] || 0,
      category: resultData?.tingkatMinatKategori?.['Total'] || '-',
  };

  const bidangMinat = [
    { label: 'Pribadi Sosial', val: getBidang('Pribadi Sosial') },
    { label: 'Natural', val: getBidang('Natural') },
    { label: 'Mekanik', val: getBidang('Mekanik') },
    { label: 'Bisnis', val: getBidang('Bisnis') },
    { label: 'Seni', val: getBidang('Seni') },
    { label: 'Sains', val: getBidang('Sains') },
  ];

  const tipeMinat = [
    { label: 'Verbal', val: getTipe('Verbal') },
    { label: 'Komputatif', val: getTipe('Komputatif') },
    { label: 'Manipulatif', val: getTipe('Manipulatif') },
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Laporan Hasil Tes Individu</Text>
          <Text style={styles.subtitle}>Kategori: Tes Minat Jabatan</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekapitulasi Bidang Minat</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellTitle}>Nama Partisipan</Text>
            {bidangMinat.map((b) => (
              <Text key={b.label} style={styles.tableCell}>{b.label}</Text>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCellTitle}>{user.fullName}</Text>
            {bidangMinat.map((b) => (
              <View key={b.label} style={styles.tableCell}>
                <Text>{b.val.score}</Text>
                <Text style={styles.tableCellCategory}>{b.val.category}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekapitulasi Tipe & Tingkat Minat</Text>
          
          <View style={styles.tableHeader}>
            {tipeMinat.map((t) => (
              <Text key={t.label} style={styles.tableCell}>{t.label}</Text>
            ))}
            <Text style={styles.tableCell}>Tingkat (Total)</Text>
          </View>
          
          <View style={styles.tableRow}>
            {tipeMinat.map((t) => (
              <View key={t.label} style={styles.tableCell}>
                <Text>{t.val.score}</Text>
                <Text style={styles.tableCellCategory}>{t.val.category}</Text>
              </View>
            ))}
            <View style={styles.tableCell}>
              <Text>{tingkat.score}</Text>
              <Text style={styles.tableCellCategory}>{tingkat.category}</Text>
            </View>
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
