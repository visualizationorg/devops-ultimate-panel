import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, fileName = 'rapor') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rapor');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToPDF = (data, columns, fileName = 'rapor') => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.field])),
    styles: { fontSize: 8, cellPadding: 2 }
  });
  doc.save(`${fileName}.pdf`);
}; 
