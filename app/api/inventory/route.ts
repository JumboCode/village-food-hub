// route file for inventory
const { PrismaClient } = require ('@prisma/client');
const prisma = new PrismaClient();

async function createInventoryItem(data : {
  itemName     : string,
  categoryName : string,
  quantity     : number, 
  units        : string, 
  lastUpdated  : Date
}) {
  return await prisma.inventory.create({ 
    data: { ...data }
  })
}


async function getInventoryItems() {
  return await prisma.inventory.findMany()
}


async function updateInventoryItem(data : {
  itemName     : string,
  categoryName : string,
  quantity     : number, 
  units        : string, 
  lastUpdated  : Date
}) {
  const { itemName, ...newData } = data;
  return await prisma.inventory.update({
    where : {
      itemName : data.itemName
    }, data: { ...newData }
  })
}


async function deleteInventoryItem(deleteItem : string) {
  return await prisma.inventory.delete({
    where : {
      itemName : deleteItem
    },
  })
}

module.exports = { createInventoryItem, getInventoryItems, updateInventoryItem, deleteInventoryItem };