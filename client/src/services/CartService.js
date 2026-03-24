import axios from './api';

// Hämtar alla kundvagnar från API:et
export async function getAll() {
  try {
    const response = await axios.get('/carts');
    
    if (response.status === 200) return response.data;
    else {
      console.log(response); // Loggar oväntat svar för felsökning
      return [];
    }
  } catch (e) {
    // Loggar felmeddelandet från servern om det finns, annars hela felet
    e?.response ? console.log(e.response.data) : console.log(e);
  }
}