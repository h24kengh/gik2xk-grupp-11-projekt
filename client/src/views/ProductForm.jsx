import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Stack, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { getOne, create, update, remove } from '../services/ProductService';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  // Hämta produkt om vi är i redigeringsläge
  useEffect(() => {
    if (isEditMode) {
      getOne(id)
        .then((product) => {
          if (product) {
            setFormData({
              name: product.name || '',
              price: product.price || '',
              description: product.description || '',
              stock: product.stock || '',
            });
          } else {
            setError('Produkten hittades inte');
          }
        })
        .catch((err) => {
          console.error('Fel vid hämtning:', err);
          setError('Kunde inte hämta produkten');
        })
        .finally(() => {
          setFetchLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Rensa fel när användaren skriver
    if (error) setError('');
  };

  function onDelete() {
    remove(id).then(response => console.log(response));
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Produktnamn måste anges');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Pris måste vara större än 0');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Beskrivning måste anges');
      return false;
    }
    if (!formData.stock || formData.stock < 0) {
      setError('Lagersaldo måste vara 0 eller mer');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: parseInt(formData.stock),
      };

      if (isEditMode) {
        // Uppdatera befintlig produkt
        const result = await update(id, productData);
        if (result) {
          console.log('Produkt uppdaterad:', result);
          navigate(`/product/${id}`); // Gå till produktsidan
        } else {
          setError('Kunde inte uppdatera produkten');
        }
      } else {
        // Skapa ny produkt
        const result = await create(productData);
        if (result) {
          console.log('Ny produkt skapad:', result);
          navigate(`/product/${result.id}`); // Gå till den nya produkten
        } else {
          setError('Kunde inte skapa produkten');
        }
      }
    } catch (err) {
      console.error('Fel vid sparande:', err);
      setError('Ett fel uppstod vid sparande');
    } finally {
      setLoading(false);
    }
  };

  // Visa laddningsindikator medan vi hämtar produkt (redigeringsläge)
  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        {isEditMode ? `Ändra produkt` : 'Ny produkt'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Produktnamn"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
          />

          <TextField
            label="Pris (kr)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            disabled={loading}
            inputProps={{ min: 0, step: 0.01 }}
          />

          <TextField
            label="Beskrivning"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            required
            disabled={loading}
          />

          <TextField
            label="Lagersaldo"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            disabled={loading}
            inputProps={{ min: 0 }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Sparar...' : (isEditMode ? 'Spara ändringar' : 'Skapa produkt')}
          </Button>

          <Button 
            variant="contained" 
            size="large"
            color ="error"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Avbryt
          </Button>

          <Button onClick={onDelete} variant="contained" color="error">
            Ta bort
          </Button>

         {/*  <Button onClick={onSave} variant="contained" color= "success">
            Spara
          </Button> */}

        </Stack>
      </form>
    </Box>
  );
}

export default ProductForm;