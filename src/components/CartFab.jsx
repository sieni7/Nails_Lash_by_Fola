import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartFab = () => {
  const { panier } = useCart();

  const openCart = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <div className="cart-fab" onClick={openCart}>
      <span className="cart-icon">🛒</span>
      <span className="cart-count">{panier.length}</span>
    </div>
  );
};

export default CartFab;
