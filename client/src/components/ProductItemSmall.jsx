import { CardMedia } from "@mui/material";
import placeholderImage from '../assets/hero.png';
function productItemSmall() {
    return <h3>ProductItemSmall</h3>;
}
<CardMedia
component="img"
height= "300"
image={product.imageUrl || placeholderImage}

/>

export default productItemSmall;