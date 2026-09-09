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
  tableCellCategory: { fontSize: 6, textAlign: 'center', marginTop: 2, color: '#6b7280' },
  tableCellTotal: { flex: 1, fontSize: 8, color: '#4f46e5', textAlign: 'center', fontWeight: 'extrabold' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }
});

export const BakumReport = ({ data, user }: { data: any, user: any }) => {
  const getPersoalan = (key: string, maxScore: number) => {
    let correct = 0;
    if (data && data[key] && data[key].score) {
      correct = data[key].score.correct || 0;
    }
    
    let category = 'Rendah';
    if (maxScore === 20) {
      if (correct >= 16) category = 'Tinggi';
      else if (correct >= 8) category = 'Sedang';
    } else if (maxScore === 30) {
      if (correct >= 21) category = 'Tinggi';
      else if (correct >= 11) category = 'Sedang';
    } else if (maxScore === 40) {
      if (correct >= 31) category = 'Tinggi';
      else if (correct >= 16) category = 'Sedang';
    } else if (maxScore === 80) {
      if (correct >= 51) category = 'Tinggi';
      else if (correct >= 31) category = 'Sedang';
    }

    return { correct, category };
  };

  const p2 = getPersoalan('persoalan_2', 40);
  const p3 = getPersoalan('persoalan_3', 20);
  const p4 = getPersoalan('persoalan_4', 40);
  const p5 = getPersoalan('persoalan_5', 20);
  const p6 = getPersoalan('persoalan_6', 30);
  const p7 = getPersoalan('persoalan_7', 20);
  const p8 = getPersoalan('persoalan_8', 20);
  const p9 = getPersoalan('persoalan_9', 20);
  const p10 = getPersoalan('persoalan_10', 80);

  const totalRawScore = 
    p2.correct + p3.correct + p4.correct + p5.correct + 
    p6.correct + p7.correct + p8.correct + p9.correct + p10.correct;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Laporan Hasil Tes Individu</Text>
          <Text style={styles.subtitle}>Kategori: Tes BAKUM (Bakat Umum)</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekapitulasi Hasil</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellName}>Nama Partisipan</Text>
            <Text style={styles.tableCell}>P2</Text>
            <Text style={styles.tableCell}>P3</Text>
            <Text style={styles.tableCell}>P4</Text>
            <Text style={styles.tableCell}>P5</Text>
            <Text style={styles.tableCell}>P6</Text>
            <Text style={styles.tableCell}>P7</Text>
            <Text style={styles.tableCell}>P8</Text>
            <Text style={styles.tableCell}>P9</Text>
            <Text style={styles.tableCell}>P10</Text>
            <Text style={styles.tableCellTotal}>Total</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCellName}>{user.fullName}</Text>
            <View style={styles.tableCell}><Text>{p2.correct}</Text><Text style={styles.tableCellCategory}>{p2.category}</Text></View>
            <View style={styles.tableCell}><Text>{p3.correct}</Text><Text style={styles.tableCellCategory}>{p3.category}</Text></View>
            <View style={styles.tableCell}><Text>{p4.correct}</Text><Text style={styles.tableCellCategory}>{p4.category}</Text></View>
            <View style={styles.tableCell}><Text>{p5.correct}</Text><Text style={styles.tableCellCategory}>{p5.category}</Text></View>
            <View style={styles.tableCell}><Text>{p6.correct}</Text><Text style={styles.tableCellCategory}>{p6.category}</Text></View>
            <View style={styles.tableCell}><Text>{p7.correct}</Text><Text style={styles.tableCellCategory}>{p7.category}</Text></View>
            <View style={styles.tableCell}><Text>{p8.correct}</Text><Text style={styles.tableCellCategory}>{p8.category}</Text></View>
            <View style={styles.tableCell}><Text>{p9.correct}</Text><Text style={styles.tableCellCategory}>{p9.category}</Text></View>
            <View style={styles.tableCell}><Text>{p10.correct}</Text><Text style={styles.tableCellCategory}>{p10.category}</Text></View>
            <View style={styles.tableCellTotal}><Text>{totalRawScore}</Text></View>
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
