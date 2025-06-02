import axios from 'axios';
import { RomanianIdRecord } from './Types';

export async function fetchReviewerRecords(): Promise<RomanianIdRecord[] | null> {
  try {
    const token = localStorage.getItem('token') ?? '';
    const response = await axios.get('http://localhost:5099/api/reviewerapi/records', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching reviewer records:', error);
    return null;
  }
}
