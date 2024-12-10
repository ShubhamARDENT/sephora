// Functionality of the page should appear here
const productsApi =
  "https://dummyjson.com/products?limit=12&select=title,description,price,rating,images,thumbnail ";

(async () => {
  const productNames = document.querySelectorAll(".bestseller_name");
  const productImges = document.querySelectorAll(".product_img");
  const productDesc = document.querySelectorAll(".bestseller_desc");
  const productPrice = document.querySelectorAll(".product_price");
  const productsData = await fetch(productsApi).then((response) =>
    response.json()
  );

  const { products } = productsData;
  console.log(products);
  products.forEach((product, index) => {
    productNames[index].innerHTML = product.title;
    productImges[index].src = product.thumbnail;
    const products = product.description.split(" ").slice(1, 10);
    productDesc[index].innerHTML = products.join(" ").concat("...");
    productPrice[index].innerHTML = `$${product.price}`;
  });
})();
