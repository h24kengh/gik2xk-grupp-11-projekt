import axios from './api';

// Mock-data för utveckling när backend inte är tillgänglig
const mockProducts = [
  { 
    id: 1, 
    name: 'Premium Laptop', 
    price: 12999, 
    description: 'Högpresterande laptop med 16GB RAM och 512GB SSD', 
    stock: 8 
  },
  { 
    id: 2, 
    name: 'Trådlös Mus', 
    price: 399, 
    description: 'Ergonomisk trådlös mus med lång batteritid', 
    stock: 15 
  },
  { 
    id: 3, 
    name: '27" 4K Skärm', 
    price: 3499, 
    description: '4K UHD skärm med IPS-panel', 
    stock: 5 
  }
];

export async function getAll(endpoint = '/products') {
  try {
    const response = await axios.get(endpoint);
    
    if (response.status === 200 && Array.isArray(response.data)) {
      console.log(' Hämtade produkter från API');
      return response.data;
    } else {
      console.log(' API returnerade inte en array, använder mock-data');
      return mockProducts; //  Här returneras mock-data
    }
  } catch(e) {
    // Vid fel, returnera mock-data
    console.log(' API-anrop misslyckades, använder mock-data');
    e?.response ? console.log('Fel:', e.response.data) : console.log('Fel:', e.message);
    return mockProducts; //  Här returneras mock-data vid fel
  }
}

export async function getOne(id) {
  try {
    const response = await axios.get(`/products/${id}`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch(e) {
    // Försök hitta produkten i mock-data
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (product) {
      console.log(`Använder mock-data för produkt ${id}`);
      return product;
    }
    e?.response ? console.log(e.response.data) : console.log(e);
    return null;
  }
}

export async function create(product) {
  try {
    const response = await axios.post('/products', product);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (e) {
    console.log('Simulerar skapande av produkt med mock-data');
    const newProduct = {
      id: mockProducts.length + 1,
      ...product
    };
    mockProducts.push(newProduct);
    return newProduct;
  }
}

export async function update(id, product) {
  try {
    const response = await axios.put(`/products/${id}`, product);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (e) {
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...product, id: parseInt(id) };
      return mockProducts[index];
    }
    e?.response ? console.log(e.response.data) : console.log(e);
    return null;
  }
}

export async function remove(id) {
  try {
    const response = await axios.delete(`/products/${id}`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (e) {
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      const deleted = mockProducts.splice(index, 1);
      return deleted[0];
    }
    e?.response ? console.log(e.response.data) : console.log(e);
    return null;
  }
}

export async function addToCart(productId, userId, amount) {
  try {
    const response = await axios.post(`/products/${productId}/addToCart`, {userId, amount});
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (e) {
    console.log(`Simulerar: Användare ${userId} la till ${amount} st av produkt ${productId}`);
    const product = mockProducts.find(p => p.id === parseInt(productId));
    if (product) {
      return { success: true, product, amount };
    }
    e?.response ? console.log(e.response.data) : console.log(e);
    return null;
  }
}