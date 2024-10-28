// route file for inventory

// set prisma client ??
const { PrismaClient } = require ('@prisma/client');
const prisma = new PrismaClient();

async function Create(data : {
  itemName     : string,
  categoryName : string,
  quantity     : number, 
  units        : string, 
  lastUpdated  : Date
}) {
  return await prisma.inventory.create(
    { data: 
      { 
        itemName: data.itemName, 
        categoryName: data.categoryName,  
        quantity: data.quantity, 
        units: data.units, 
        lastUpdated: data.lastUpdated
      }
    }
  )
}


async function Read() {
  return await prisma.inventory.findMany()
}


async function Update(data : {
  itemName     : string,
  categoryName : string,
  quantity     : number, 
  units        : string, 
  lastUpdated  : Date
}) {
  return await prisma.inventory.update({
    where : {
      itemName : data.itemName
    }, data: 
      { 
        categoryName: data.categoryName,  
        quantity: data.quantity, 
        units: data.units, 
        lastUpdated: data.lastUpdated
      }
  })
}


async function Delete(deleteItem : string) {
  return await prisma.inventory.delete({
    where : {
      itemName : deleteItem
    },
  })
}

module.exports = { Create, Read, Update, Delete };