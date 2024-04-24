import { ProductByService } from '@/types';
import React, { useState, createContext, useEffect } from 'react';
import {
  saveProductContext,
  getProductContext,
  PRODUCT_TOKEN_KEY,
} from '@/data/product/local-storage-service';

interface ProductProvider {
  productByService: ProductByService | undefined;
  verifyExistsProduct: () => void;
  updateProduct: (product: ProductByService) => void;
}

export const productContext = createContext<ProductProvider | undefined>(
  undefined
);

productContext.displayName = 'ProductContext';

export const useProduct = () => {
  const context = React.useContext(productContext);
  if (context === undefined) {
    throw new Error(`use Product must be used within a CartProvider`);
  }
  return context;
};

export const ProductProvider: React.FC = (props) => {
  const [product, setProduct] = useState<ProductByService>();
  console.log(product + 'HOLLA');

  const updateProduct = (product: ProductByService) => {
    setProduct(product);
    saveProductContext(PRODUCT_TOKEN_KEY, JSON.stringify(product));
  };

  const verifyExistsProduct = () => {
    let productString: string | null = getProductContext(PRODUCT_TOKEN_KEY);
    const productJSON: ProductByService = JSON.parse(productString as string);
    if (productJSON) {
      setProduct(productJSON);
    }
  };

  useEffect(() => {
    verifyExistsProduct();
  }, []);

  const value = {
    productByService: product,
    verifyExistsProduct,
    updateProduct,
  };

  return <productContext.Provider value={value} {...props} />;
};
