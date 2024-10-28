
const CRUD = require("./route.ts");
async function main() {
  const response = await CRUD.Create({ itemName: "carrots", categoryName: "fruit", quantity: 3, units: "pounds", lastUpdated: new Date(2024, 10, 27)});
  console.log(await CRUD.Read());
  //CRUD.Delete("apple");
  //CRUD.Delete("carrots");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    //await prisma.$disconnect();
  });

// run the script by doing: ts-node testConnection.ts