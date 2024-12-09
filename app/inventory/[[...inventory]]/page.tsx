"use client"
import React, { useEffect }from "react";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
function getInventory() {
  try {
    return fetch("/../api/inventory", {method : 'GET'})
    .then((response) => {
        if (!response.ok) throw response;
        return response.json();
    })
    .then ((jsonData : any) => jsonData.data )
    .then((inventoryObjects : any) => {
      const listOfLists = inventoryObjects.map((object : any) => {
        let fields = Object.values(object);
        var date = new Date(fields[fields.length - 1] as string);
        var datestring =  (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear();
        fields[fields.length - 1] = datestring;
        console.log(Object.values(object))
        return fields;
      });
      
      console.log("List of Lists:", listOfLists)
      return listOfLists
    })
  } catch(error) {
    console.error(error);
    return Promise.resolve([]);
  }
  
}
const InternalViewInventoryPage: React.FC = () => {
  const [inventory, setInventory] = React.useState<any>();
  useEffect(() => {
    getInventory()
      .then((items: any) => {setInventory(items)})
   }, []);
  return (
    <InventorySpreadsheet inventoryItems={inventory} />
  );
};
 
export default InternalViewInventoryPage;