// Functionality of the page should appear here
const productsApi = "https://dummyjson.com/products";

const productsPerPage = 12;
let currentPage = 1;

// fetch and dispaly
(async function fetchAndDisplay(page = 1) {
  const productNames = document.querySelectorAll(".bestseller_name");
  const productImges = document.querySelectorAll(".product_img");
  const productDesc = document.querySelectorAll(".bestseller_desc");
  const productPrice = document.querySelectorAll(".product_price");
  const paginationContainer = document.querySelector(".page_container");

  const rating = document.querySelectorAll(".bestseller_icon");
  currentPage = page;
  // console.log(currentPage);
  const skip = (currentPage - 1) * productsPerPage;
  const url = `${productsApi}?limit=${productsPerPage}&skip=${skip}&select=title,description,price,thumbnail,rating`;
  const productsData = await fetch(url).then((response) => response.json());
  // console.log(productsData, "response");
  const { products, total } = productsData;

  // console.log(products);
  // rendering of products
  // displayBox.innerHTML = "";
  paginationContainer.innerHTML = "";

  products.forEach((product, index) => {
    rating[index].innerHTML = "";
    productNames[index].innerHTML = product.title;
    productImges[index].src = product.thumbnail;
    const products = product.description.split(" ").slice(1, 10);
    productDesc[index].innerHTML = products.join(" ").concat("...");
    productPrice[index].innerHTML = `$${product.price}`;
    // console.log(product.rating);

    const productRating = Math.round(product.rating);

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("i");
      if (i < productRating) {
        star.classList.add("fa-solid", "fa-star");
      } else {
        star.classList.add("fa-regular", "fa-star");
      }
      rating[index].appendChild(star);
    }
  });

  const totalPages = Math.ceil(total / productsPerPage);
  // previous button
  const previousButton = document.createElement("button");
  previousButton.innerHTML = "<";
  previousButton.classList.add("pagination_button");
  if (page === 1) {
    previousButton.disabled = true;
  }
  previousButton.onclick = () => fetchAndDisplay(page - 1);
  paginationContainer.appendChild(previousButton);
  // pages
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination_button");
    if (i === page) button.classList.add("active");
    button.onclick = () => fetchAndDisplay(i);
    paginationContainer.appendChild(button);
  }
  // forwards buttont
  const forwardButton = document.createElement("button");
  forwardButton.classList.add("pagination_button");
  forwardButton.innerHTML = ">";
  if (page === totalPages) {
    forwardButton.disabled = true;
  }
  forwardButton.onclick = () => fetchAndDisplay(page + 1);
  paginationContainer.appendChild(forwardButton);
})(currentPage);


