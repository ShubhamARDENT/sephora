// Functionality of the page should appear here
const productsApi =
  "https://dummyjson.com/products?limit=12&select=title,description,price,rating,images ";
const productName = document.querySelector(".bestseller_name")(async () => {
  const productsData = await fetch(productsApi).then((response) =>
    response.json()
  );

  const { products } = productsData;
  console.log(products);
  products.map((product) => {});
})();
