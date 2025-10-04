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

const TypeBadge = styled.span<{ type: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  background-color: ${props => 
    props.type === 'sale' 
      ? '#fca5a5'
      : props.type === 'purchase'
      ? props.theme.colors.primary[100]
      : props.theme.colors.secondary[100]
  };
  color: ${props => 
    props.type === 'sale' 
      ? '#7f1d1d'
      : props.type === 'purchase'
      ? props.theme.colors.primary[800]
      : props.theme.colors.secondary[800]
  };
`;

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const QuantityCell = styled.strong<{ quantity: number }>`
  color: ${props => 
    props.quantity < 0 
      ? '#dc2626' 
      : props.quantity > 0 
      ? '#059669' 
      : 'inherit'
  };
`;

interface StockMovement {
  id: string;
  productId: string;
  type: string;
  quantity: number;
  date: string;
  reference: string;
  notes: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  quantityInStock: number;
}

const StockManagement = () => {
  const selectedCompany = useAppStore((state) => state.selectedCompany);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) {
        setStockMovements([]);
        setProducts([]);
        setFilteredMovements([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [movementData, productData] = await Promise.all([
          InventoryService.getStockMovements(selectedCompany.id),
          InventoryService.getProducts(selectedCompany.id)
        ]);
        setStockMovements(movementData);
        setProducts(productData);
        setFilteredMovements(movementData);
      } catch (error) {
        console.error('Failed to load stock movements:', error);
        setStockMovements([]);
        setProducts([]);
        setFilteredMovements([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCompany]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMovements(stockMovements);
    } else {
      const filtered = stockMovements.filter(movement => {
        const product = products.find(p => p.id === movement.productId);
        const productName = product ? product.name : '';
        const productSku = product ? product.sku : '';
        
        return (
          productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.notes.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredMovements(filtered);
    }
  }, [searchTerm, stockMovements, products]);

  const getProductInfo = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatQuantity = (quantity: number, type: string) => {
    const sign = type === 'sale' || type === 'adjustment' && quantity < 0 ? '' : '+';
    return `${sign}${quantity}`;
  };

  if (!selectedCompany) {
    return (
      <PageContainer>
        <PageTitle>Stock Management</PageTitle>
        <CenteredMessage>
          <p>Please select a company to view stock movements.</p>
        </CenteredMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Stock Management</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by product name, SKU, type, or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" size="sm">
          Add Stock Movement
        </Button>
      </SearchContainer>

      {loading ? (
        <CenteredMessage>
          <p>Loading stock movements...</p>
        </CenteredMessage>
      ) : filteredMovements.length === 0 ? (
        <CenteredMessage>
          <p>{searchTerm ? 'No stock movements found matching your search.' : 'No stock movements found.'}</p>
        </CenteredMessage>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Quantity</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Reference</TableHeaderCell>
                <TableHeaderCell>Current Stock</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => {
                const product = getProductInfo(movement.productId);
                return (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <strong>{product?.name || 'Unknown Product'}</strong>
                    </TableCell>
                    <TableCell>{product?.sku || '-'}</TableCell>
                    <TableCell>
                      <TypeBadge type={movement.type}>
                        {movement.type}
                      </TypeBadge>
                    </TableCell>
                    <TableCell>
                      <QuantityCell quantity={movement.quantity}>
                        {formatQuantity(movement.quantity, movement.type)}
                      </QuantityCell>
                    </TableCell>
                    <TableCell>{formatDate(movement.date)}</TableCell>
                    <TableCell>{movement.reference}</TableCell>
                    <TableCell>
                      <strong>{product?.quantityInStock || 0}</strong>
                    </TableCell>
                    <TableCell>{movement.notes}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default StockManagement;
