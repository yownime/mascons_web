"use client";

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface ExportExcelButtonProps {
  data: any[];
}

export default function ExportExcelButton({ data }: ExportExcelButtonProps) {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('TO 1');

    // Add empty rows to match the 5 rows offset in the original excel file
    for (let i = 0; i < 5; i++) {
      sheet.addRow([]);
    }

    // Add Headers
    sheet.addRow([
      'NO',
      'NAMA LENGKAP',
      'IQ',
      'K35AEPLIN',
      '',
      '',
      'EPP65',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
    sheet.addRow([
      '',
      '',
      '1',
      '2.0',
      '3.0',
      '1',
      '2.0',
      '3.0',
      '4.0',
      '5.0',
      '6.0',
      '7.0',
      '8.0',
      '9.0',
      '10.0',
      '11.0',
      '12.0',
      '13.0',
      '14.0',
      '15.0',
      '16.0',
    ]);

    // Add Data
    data.forEach((item, index) => {
      sheet.addRow([
        index + 1,
        item.userName,
        item.iq || '',
        item.kraepelin_kecepatan || '',
        item.kraepelin_ketelitian || '',
        item.kraepelin_keajegan || '',
        item.epps_scores[0] || 0,
        item.epps_scores[1] || 0,
        item.epps_scores[2] || 0,
        item.epps_scores[3] || 0,
        item.epps_scores[4] || 0,
        item.epps_scores[5] || 0,
        item.epps_scores[6] || 0,
        item.epps_scores[7] || 0,
        item.epps_scores[8] || 0,
        item.epps_scores[9] || 0,
        item.epps_scores[10] || 0,
        item.epps_scores[11] || 0,
        item.epps_scores[12] || 0,
        item.epps_scores[13] || 0,
        item.epps_scores[14] || 0,
        item.epps_consistency || 0,
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Rekapitulasi_EPPS_TO_1.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
    >
      <FileSpreadsheet size={16} className="mr-2" />
      Download Excel (Format TO 1)
    </button>
  );
}
