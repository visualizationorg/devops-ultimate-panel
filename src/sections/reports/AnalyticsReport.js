import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { IconFileSpreadsheet, IconFilePdf } from '@tabler/icons-react';
import { exportToExcel, exportToPDF } from 'utils/exportUtils';

const AnalyticsReport = ({ data }) => {
  const columns = [
    { field: 'date', header: 'Tarih' },
    { field: 'commits', header: 'Commit Sayısı' },
    { field: 'pullRequests', header: 'PR Sayısı' },
    { field: 'mergeTime', header: 'Ortalama Birleştirme Süresi' },
    { field: 'deployments', header: 'Deployment Sayısı' }
  ];

  const handleExcelExport = () => {
    exportToExcel(data, 'analiz_raporu');
  };

  const handlePDFExport = () => {
    exportToPDF(data, columns, 'analiz_raporu');
  };

  // Toplam değerleri hesapla
  const totals = data.reduce((acc, curr) => ({
    commits: acc.commits + curr.commits,
    pullRequests: acc.pullRequests + curr.pullRequests,
    deployments: acc.deployments + curr.deployments,
    mergeTime: acc.mergeTime + curr.mergeTime
  }), { commits: 0, pullRequests: 0, deployments: 0, mergeTime: 0 });

  // Ortalama merge süresini hesapla
  const avgMergeTime = (totals.mergeTime / data.length).toFixed(2);

  return (
    <Card>
      <CardHeader 
        title="Analiz Raporu" 
        action={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<IconFileSpreadsheet />}
              onClick={handleExcelExport}
            >
              Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconFilePdf />}
              onClick={handlePDFExport}
            >
              PDF
            </Button>
          </Stack>
        }
      />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Özet Bilgiler
          </Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Toplam Commit
              </Typography>
              <Typography variant="h5">
                {totals.commits}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Toplam PR
              </Typography>
              <Typography variant="h5">
                {totals.pullRequests}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Toplam Deployment
              </Typography>
              <Typography variant="h5">
                {totals.deployments}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Ort. Birleştirme Süresi
              </Typography>
              <Typography variant="h5">
                {avgMergeTime} dk
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Detaylı Rapor
        </Typography>
        
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell 
                    key={column.field}
                    sx={{ 
                      backgroundColor: 'background.default',
                      fontWeight: 'bold'
                    }}
                  >
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.commits}</TableCell>
                  <TableCell>{row.pullRequests}</TableCell>
                  <TableCell>{row.mergeTime} dk</TableCell>
                  <TableCell>{row.deployments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsReport; 
