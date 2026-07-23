import React from 'react';
import { renderToFile } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

import { CFITReport } from './app/lib/reports/cfit';
import { EPPSReport } from './app/lib/reports/epps';
import { BakumReport } from './app/lib/reports/bakum';
import { CPMReport } from './app/lib/reports/cpm';
import { KraepelinReport } from './app/lib/reports/kraepelin';
import { InteligensiUmumReport } from './app/lib/reports/inteligensi_umum';
import { MinatJabatanReport } from './app/lib/reports/minat_jabatan';

import {
  mockUser,
  mockCFIT,
  mockEPPS,
  mockBakum,
  mockCPM,
  mockKraepelin,
  mockInteligensiUmum,
  mockMinatJabatan
} from './app/lib/reports/mockData';

const outputDir = path.join(__dirname, 'contoh_laporan_client');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const generatePDFs = async () => {
  console.log('Generating Mock PDFs for Client Presentation...');

  try {
    await renderToFile(<CFITReport data={mockCFIT} user={mockUser} />, path.join(outputDir, 'Report_CFIT.pdf'));
    console.log('✅ CFIT Report Generated');
    
    await renderToFile(<EPPSReport data={mockEPPS} user={mockUser} />, path.join(outputDir, 'Report_EPPS.pdf'));
    console.log('✅ EPPS Report Generated');

    await renderToFile(<BakumReport data={mockBakum} user={mockUser} />, path.join(outputDir, 'Report_BAKUM.pdf'));
    console.log('✅ BAKUM Report Generated');

    await renderToFile(<CPMReport data={mockCPM} user={mockUser} />, path.join(outputDir, 'Report_CPM.pdf'));
    console.log('✅ CPM Report Generated');

    await renderToFile(<KraepelinReport data={mockKraepelin} user={mockUser} />, path.join(outputDir, 'Report_Kraepelin.pdf'));
    console.log('✅ Kraepelin Report Generated');

    await renderToFile(<InteligensiUmumReport data={mockInteligensiUmum} user={mockUser} />, path.join(outputDir, 'Report_Inteligensi_Umum.pdf'));
    console.log('✅ Inteligensi Umum Report Generated');

    await renderToFile(<MinatJabatanReport data={mockMinatJabatan} user={mockUser} />, path.join(outputDir, 'Report_Minat_Jabatan.pdf'));
    console.log('✅ Minat Jabatan Report Generated');

    console.log(`\n🎉 All PDFs generated successfully in: ${outputDir}`);
  } catch (error) {
    console.error('Error generating PDFs:', error);
  }
};

generatePDFs();
