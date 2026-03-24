import { createContext, useContext, useState } from 'react';

// Skapar context för kundvagnen som delas globalt i appen
const CartContext = createContext();


export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Lägger till en produkt – ökar antal om den redan finns i korgen
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Tar bort en produkt helt från kundkorgen
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Ökar antalet av en produkt med 1
  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Minskar antalet med 1 – tar bort produkten om antalet når 0
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Tömmer hela kundkorgen
  const clearCart = () => {
    setCartItems([]);
  };

  // Beräknar totalpriset för alla produkter i korgen
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0; // Tvinga till siffra, annars 0
    const qty = Number(item.quantity) || 0;
    return total + (price * qty);
  }, 0);

  return (
    // Tillhandahåller kundvagnens state och funktioner till hela komponentträdet
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hjälpfunktion för att enkelt komma åt CartContext i andra komponenter
export function useCart() {
  return useContext(CartContext);
}