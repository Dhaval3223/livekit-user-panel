'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  Table,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import axiosInstance from 'src/lib/axios';

const RoomsTable = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/rooms/list/active'); // Replace with your API endpoint
        console.log('response', response);
        if (response.data.success) {
          setRooms(response.data.data); // Updated as per request
        } else {
          console.error('Failed to fetch rooms: ', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching rooms: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Room ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms?.map((room) => (
            <TableRow key={room._id}>
              <TableCell>{room.name}</TableCell>
              <TableCell>{room.roomId}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push(`/watch/${room.roomId}`)}
                >
                  Watch
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoomsTable;
