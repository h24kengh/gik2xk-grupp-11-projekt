import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';
import { useState, useEffect } from 'react';

function ProductForm() {
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const products = [
    { id: 1, name: 'Första produkten', price: 10.99, description: 'Beskrivning 1', stock: 5 },
    { id: 2, name: 'Andra produkten', price: 15.99, description: 'Beskrivning 2', stock: 3 },
    { id: 3, name: 'Tredje produkten', price: 20.99, description: 'Beskrivning 3', stock: 7 },
  ];

  const existingProduct = products.find((p) => p.id === Number(id));

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setFormData(existingProduct);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      console.log('Uppdaterar produkt:', formData);
    } else {
      console.log('Skapar ny produkt:', formData);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        {isEditMode ? `Ändra produkt (${id})` : 'Ny produkt'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Produktnamn"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Pris"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            fullWidth
          />

          <TextField
            label="Beskrivning"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Lagersaldo"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            type="number"
            fullWidth
          />

          <Button type="submit" variant="contained" size="large">
            {isEditMode ? 'Spara ändringar' : 'Skapa produkt'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default ProductForm;