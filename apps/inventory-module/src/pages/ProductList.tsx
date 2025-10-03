import React from 'react';
import styled from 'styled-components';
import { Button } from '@shared/ui-components';

const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ProductCard = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const ActionButtonsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const mockProducts = [
  {
    id: '1',
    name: 'Laptop Computer',
    sku: 'LAP-001',
    category: 'Electronics',
    stock: 25,
    price: 999.99
  },
  {
    id: '2',
    name: 'Office Chair',
    sku: 'FUR-002',
    category: 'Furniture',
    stock: 15,
    price: 299.99
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    sku: 'ACC-003',
    category: 'Accessories',
    stock: 100,
    price: 29.99
  }
];

const ProductList: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Product Management</PageTitle>
      
      <ProductGrid>
        {mockProducts.map((product) => (
          <ProductCard key={product.id}>
            <h3>{product.name}</h3>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            
            <ActionButtonsContainer>
              <Button size="sm" variant="primary">
                Edit Product
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </ActionButtonsContainer>
          </ProductCard>
        ))}
      </ProductGrid>
    </PageContainer>
  );
};

export default ProductList;
