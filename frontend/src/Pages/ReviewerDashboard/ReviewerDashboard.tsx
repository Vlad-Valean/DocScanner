import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef  } from '@mui/x-data-grid';
import './ReviewerDashboard.scss';

interface RomanianIdRecord {
  id: number;
  nume?: string;
  prenume?: string;
  cnp?: string;
  cetatenie?: string;
  sex?: string;
  dataNasterii?: string;
  validitate?: string;
  domiciliu?: string;
  serie?: string;
  numar?: string;
  locNastere?: string;
}

function ReviewerDashboard() {
  const [rows, setRows] = useState<RomanianIdRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5099/api/reviewerapi/records', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRows(response.data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nume', headerName: 'Nume', width: 150 },
    { field: 'prenume', headerName: 'Prenume', width: 150 },
    { field: 'cnp', headerName: 'CNP', width: 180 },
    { field: 'cetatenie', headerName: 'Cetățenie', width: 120 },
    { field: 'sex', headerName: 'Sex', width: 90 },
    {
      field: 'dataNasterii',
      headerName: 'Data nașterii',
      width: 130,
      valueGetter: (params: { row?: RomanianIdRecord }) =>
        params.row?.dataNasterii
          ? new Date(params.row.dataNasterii).toLocaleDateString()
          : '',
    },
    {
      field: 'validitate',
      headerName: 'Validitate',
      width: 130,
      valueGetter: (params: { row?: RomanianIdRecord }) =>
        params.row?.validitate
          ? new Date(params.row.validitate).toLocaleDateString()
          : '',
    },
    { field: 'domiciliu', headerName: 'Domiciliu', width: 200 },
    { field: 'serie', headerName: 'Serie', width: 100 },
    { field: 'numar', headerName: 'Număr', width: 100 },
    { field: 'locNastere', headerName: 'Loc naștere', width: 150 },
  ];

  return (
    <Container fixed className="ReviewerDashboard d-flex flex-column justify-content-center align-content-center min-vh-100">
      <h1 className="m-4">DASHBOARD</h1>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>
    </Container>
  );
}

export default ReviewerDashboard;
