import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createCategory(data: {
    itemName : string,
    name: string,
    units: string[]
}) {
    return await prisma.categories.create(
        {   data: 
            {
                itemName: data.itemName,
                name: data.name,
                units: data.units
            }
        }
    )
}

async function readCategories() {
    const categories = await prisma.categories.findMany();
    return categories;
}

async function updateCategory(data : {
    itemName : string,
    name: string,
    units: string[]
}) {
    const { itemName, name, ...newData } = data;
    
    return await prisma.categories.update({
        where: {
            itemName_name: {
                itemName: itemName,
                name: name
            }
        }, data:
            {
                units: data.units
            },
    })
}

async function deleteCategory(data: {
    itemName: string,
    name: string
}) {
    const { itemName, name } = data;
    
    return await prisma.categories.delete({
        where: {
            itemName_name: {
                itemName: itemName,
                name: name
            }
        }
        });
    }

module.exports = {createCategory, readCategories, updateCategory, deleteCategory};
        