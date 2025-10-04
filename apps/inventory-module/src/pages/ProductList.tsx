import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, PageContainer, PageTitle } from '@shared/ui-components';
import { InventoryService } from '@shared/utils';
import { useAppStore } from '@shared/state';

const SearchContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
`;

const SearchInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  width: 300px;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const TableContainer = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.gray[50]};
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: ${props => props.theme.colors.gray[50]};
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
`;

const StockBadge = styled.span<{ stock: number; reorderLevel: number }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => 
    props.stock === 0 
      ? '#fca5a5'
      : props.stock <= props.reorderLevel
      ? '#fed7aa'
      : props.theme.colors.primary[100]
  };
  color: ${props => 
    props.stock === 0 
      ? '#7f1d1d'
      : props.stock <= props.reorderLevel
      ? '#9a3412'
      : props.theme.colors.primary[800]
  };
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  quantityInStock: number;
  reorderLevel: number;
  supplier: string;
  location: string;
  lastUpdated: string;
}

const ProductList = () => {
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedCompany) {
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await InventoryService.getProducts(selectedCompany.id);
        setProducts(productData);
        setFilteredProducts(productData);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCompany]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Product Management</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view products.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Product Management</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search products by name, SKU, category, or supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" size="sm">
          Add Product
        </Button>
      </SearchContainer>

      {loading ? (
        <CenteredMessage>
          <p>Loading products...</p>
        </CenteredMessage>
      ) : filteredProducts.length === 0 ? (
        <CenteredMessage>
          <p>{searchTerm ? 'No products found matching your search.' : 'No products found.'}</p>
        </CenteredMessage>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Stock</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Supplier</TableHeaderCell>
                <TableHeaderCell>Last Updated</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <strong>{product.sku}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{product.name}</strong>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <strong>{product.quantityInStock}</strong>
                  </TableCell>
                  <TableCell>
                    <StockBadge stock={product.quantityInStock} reorderLevel={product.reorderLevel}>
                      {getStockStatus(product.quantityInStock, product.reorderLevel)}
                    </StockBadge>
                  </TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>{formatDate(product.lastUpdated)}</TableCell>
                  <TableCell>
                    <ActionButtonsContainer>
                      <Button size="sm" variant="primary">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </ActionButtonsContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default ProductList;
