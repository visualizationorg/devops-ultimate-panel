import React from 'react';
import CustomGrid from './DataGrid';

const commonStyles = {
  "& .MuiDataGrid-columnHeaderTitle": {
    whiteSpace: "normal",
    lineHeight: "normal"
  },
  // ... diğer ortak stiller
};

export default function DataGridWrapper({ rows, columns, ...props }) {
  return (
    <CustomGrid
      rows={rows}
      columns={columns}
      getRowHeight={() => 'auto'}
      sx={commonStyles}
      {...props}
    />
  );
} 