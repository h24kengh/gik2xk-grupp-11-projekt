import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Stack, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { getOne, create, update, remove } from '../services/ProductService';
import SaveIcon from '@mui/icons-material/Save';


function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image: '',
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
              image: product.image || '',
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
    navigate('/');
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
        image: formData.image,
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

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result }); // Sparar bilden som en Base64-sträng
    };
    reader.readAsDataURL(file);
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

          <TextField
            label="Bild-URL (Länk till bild)"
            name="image"
            value={formData.image}
            onChange={handleChange}
            fullWidth
            placeholder="https://exempel.se/bild.jpg"
            disabled={loading}
          />

          <Box display="flex" gap={2} mt={2}>
          <Button 
            startIcon={<SaveIcon/>}
            color="success"
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
            sx={{ flex: 1}}
            >
            {loading ? 'Sparar...' : (isEditMode ? 'Spara' : 'Skapa produkt')}
          </Button>

          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate(-1)}
            disabled={loading}
            sx={{flex: 1}}
          >
            Avbryt
          </Button>

          <Button
            onClick={onDelete}
            variant="contained" 
            color="error" 
            size="large"
            sx={{flex: 1}}
            >
            Ta bort
          </Button>

          </Box>
             <Button 
          variant="outlined" 
          component="label"
          size='large'
          sx={{ 
           py: 1.5, // Justerar höjden så den matchar TextField/Button exakt
           textTransform: 'none', // Valfritt: hindrar knappen från att bara ha stora bokstäver
           borderColor: 'rgba(0, 0, 0, 0.23)' // Matchar färgen på TextField-kanter
          }}>
          Bifoga bild(PNG/JPG)
          {<input type="file" hidden accept="image/*" onChange={handleFileChange} />}
          </Button>
          
          {formData.image && (
          <Box sx={{ textAlign: 'center', mt: 1 }}>
          <img src={formData.image} alt="Preview" style={{ height: 100, borderRadius: 8 }} />
          </Box>
          )}

        </Stack>
      </form>
    </Box>
  );
}

export default ProductForm;