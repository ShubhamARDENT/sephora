// Functionality of the page should appear here
const productsApi = "https://dummyjson.com/products";

const productsPerPage = 12;
let currentPage = 1;
const listContainer = document.querySelector(".bestseller_lists");
// fetch and dispaly only 12 products per page
(async function fetchAndDisplay(page = 1) {
  const paginationContainer = document.querySelector(".page_container");

  currentPage = page;
  // console.log(currentPage);
  const skip = (currentPage - 1) * productsPerPage;
  const url = `${productsApi}?limit=${productsPerPage}&skip=${skip}&select=title,description,price,thumbnail,rating,tags`;
  const productsData = await fetch(url).then((response) => response.json());
  // console.log(productsData, "response");
  const { products, total } = productsData;
  // console.log(products);
  // rendering of products
  listContainer.innerHTML = "";

  paginationContainer.innerHTML = "";

  products.forEach((product) => {
    const productList = document.createElement("li");

    productList.innerHTML = `<figure class="bestseller_img">
                  <img
                    src="${product.thumbnail}"
                    alt="bestseller_img"
                    class="product_img"
                  />
                </figure>

                <p class="bestseller_name">${product.title}</p>
                <p class="bestseller_desc">
                  ${product.description
                    .split(" ")
                    .slice(1, 10)
                    .join(" ")
                    .concat("...")}
                </p>
                <span class="product_price">$${Math.round(product.price)}</span>
                <div class="bestseller_icon_container">
                  <span class="bestseller_icon">${getRatingStars(
                    product.rating
                  )}</span>
                </div>
    `;
    listContainer.appendChild(productList);
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
  // forwards button
  const forwardButton = document.createElement("button");
  forwardButton.classList.add("pagination_button");
  forwardButton.innerHTML = ">";
  if (page === totalPages) {
    forwardButton.disabled = true;
  }
  forwardButton.onclick = () => fetchAndDisplay(page + 1);
  paginationContainer.appendChild(forwardButton);
})(currentPage);

// search functionality
const search = document.querySelector(".search-box");
async function searchAndDisplay(value) {
  let searchUrl = `${productsApi}/search?q=${value}`;
  const searchResponse = await fetch(searchUrl).then((res) => res.json());
  const { products } = searchResponse;
  listContainer.innerHTML = "";
  products.forEach((product) => {
    const productList = document.createElement("li");

    productList.innerHTML = `<figure class="bestseller_img">
                      <img
                        src="${product.thumbnail}"
                        alt="bestseller_img"
                        class="product_img"
                      />
                    </figure>

                    <p class="bestseller_name">${product.title}</p>
                    <p class="bestseller_desc">
                      ${product.description
                        .split(" ")
                        .slice(1, 10)
                        .join(" ")
                        .concat("...")}
                    </p>
                    <span class="product_price">$${Math.round(
                      product.price
                    )}</span>
                    <div class="bestseller_icon_container">
                      <span class="bestseller_icon">${getRatingStars(
                        product.rating
                      )}</span>
                    </div>
        `;
    listContainer.appendChild(productList);
  });
}

function getRatingStars(rating) {
  const roundedRating = Math.round(rating);
  let stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < roundedRating) {
      stars += `<i class="fa-solid fa-star"></i>`;
    } else {
      stars += `<i class="fa-regular fa-star"></i>`;
    }
  }
  return stars;
}

function debouncedFunction(func, delay) {
  let timeout = null;
  return () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
    }, delay);
  };
}

search.addEventListener("input", () => {
  debouncedFunction((e) => {
    const value = e.target.value;
    searchAndDisplay(value);
  }, 300);
});
