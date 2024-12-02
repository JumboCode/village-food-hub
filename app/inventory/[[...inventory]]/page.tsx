import React from "react";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';

const inventoryItems = [
    ['date1', 'Fruits', 'Apple', 4, 'units'],
    ['date2', 'Fruits', 'Apple', 5, 'lbs'],
    ['date3', 'Vegetables', 'Carrot', 10, 'units'],
    ['date4', 'Grains', 'Rice', 2, 'kg']
];

const InternalViewInventoryPage: React.FC = () => {
    
    return (
        <InventorySpreadsheet inventoryItems={inventoryItems} />
    );
  };
  
  export default InternalViewInventoryPage;
  