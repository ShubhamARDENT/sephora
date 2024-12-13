// Functionality of the page should appear here
const productsApi = "https://dummyjson.com/products";
const search = document.querySelector(".search-box");
const productContainer = document.querySelector(".product_container");
const bannerImg = document.querySelector(".banner");
const productsPerPage = 12;
let currentPage = 1;
const listContainer = document.querySelector(".bestseller_lists");
// fetch and dispaly only 12 products per page
let fetchAndDisplay = (function () {
  return async function (page = 1) {
    try {
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

      if (listContainer) {
        listContainer.innerHTML = "";
      }
      if (paginationContainer) {
        paginationContainer.innerHTML = "";
      }
      if (paginationContainer) {
        paginationContainer.style.display = "flex";
      }
      if (productContainer) {
        productContainer.style.display = "none";
      }

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
        productList.addEventListener("click", () => {
          window.location.href = `product.html?id=${product.id}`;
        });

        if (listContainer) {
          listContainer.appendChild(productList);
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
      if (paginationContainer) {
        paginationContainer.appendChild(previousButton);
      }
      // pages
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pagination_button");
        if (i === page) button.classList.add("active");
        button.onclick = () => fetchAndDisplay(i);
        if (paginationContainer) {
          paginationContainer.appendChild(button);
        }
      }
      // forwards button
      const forwardButton = document.createElement("button");
      forwardButton.classList.add("pagination_button");
      forwardButton.innerHTML = ">";
      if (page === totalPages) {
        forwardButton.disabled = true;
      }
      forwardButton.onclick = () => fetchAndDisplay(page + 1);
      if (paginationContainer) {
        paginationContainer.appendChild(forwardButton);
      }
    } catch (error) {
      console.log(error);
    }
  };
})(currentPage);

fetchAndDisplay(currentPage);
// search functionality

async function searchAndDisplay() {
  try {
    const value = search.value;
    if (value == "") {
      fetchAndDisplay();
    } else {
      let searchUrl = `${productsApi}/search?q=${value}`;
      const searchResponse = await fetch(searchUrl).then((res) => res.json());
      const { products } = searchResponse;
      listContainer.innerHTML = "";
      products.forEach((product) => {
        const productList = document.createElement("li");
        const paginationContainer = document.querySelector(".page_container");
        paginationContainer.style.display = "none";
        productContainer.style.display = "none";
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
  } catch (error) {
    console.log(error);
  }
}

//get a specficproduct
async function getProductDetails(productid) {
  console.log(bannerImg);
  bannerImg.style.display = "none";
  const paginationContainer = document.querySelector(".page_container");

  console.log(productContainer);
  let searchUrl = `${productsApi}/${productid}?&select=title,description,price,thumbnail,rating`;
  const specificproduct = await fetch(searchUrl).then((res) => res.json());
  console.log(specificproduct);
  // hide pagination
  paginationContainer.style.display = "none";
  // hide other lists
  listContainer.style.display = "none";
  // display product container
  productContainer.style.display = "block";
  productContainer.innerHTML = `
        <div class="parent">
          <div class="child1">
            <figure class="product_img">
              <img
                src=${specificproduct.thumbnail}
                alt="product_img"
              />
            </figure>
          </div>
          <div class="child2">
           <span class="prodcut_title">${specificproduct.title}</span>
            <p>${specificproduct.description}</p>
            <span>M.R.P $ ${Math.round(specificproduct.price)}</span>
          </div>
        </div>
        <div class="child3">
            <button class="cart">Add to Cart</button>
            <button class="buy_it_now">Buy It now</button>
            <button class="back_home">Back to Home</button>
        </div>
    `;

  const backToHome = document.querySelector(".back_home");
  console.log(backToHome);
  backToHome.addEventListener("click", () => {
    listContainer.style.display = "block";
    //if not current page can  go page 1
    fetchAndDisplay(currentPage);
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

// debounce function
function debouncedFunction(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

//quey params
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// Fetch and display the product details
async function fetchProductDetails(productId, container) {
  // console.log(productId);
  try {
    const response = await fetch(
      `${productsApi}/${productId}?&select=title,description,price,images,thumbnail`
    );
    const product = await response.json();
    // console.log(product);

    const imagesArray =
      product.images.length > 1
        ? product.images
            .map(
              (each) =>
                `<li class="splide__slide"><img src="${each}" alt="product_img" /></li>`
            )
            .join("")
        : Array(3)
            .fill(
              `<li class="splide__slide"><img src="${product.images[0]}" alt="product_img" /></li>`
            )
            .join("");

    const productContainer = document.querySelector(container);
    productContainer.style.display = "block";
    console.log(productContainer);
    productContainer.innerHTML = `
  <div class="parent">
    <div class="child1">
    
        <section class="splide" aria-labelledby="carousel-heading">
         <div class="splide__track">
         <ul class="splide__list">
             ${imagesArray}
         </ul>
         <div class="splide__track">
         <ul class="splide__list">
         
          </ul>
         </div>
         </div>
        </section>

    </div>
   <div class="child2">
   <span class="product_title">${product.title}</span>
   <span class="product_desc">${product.description}</span>
   <span class="product_price">M.R.P &#x20B9; ${Math.round(
     product.price
   )}</span>
   <span class="product_tax">(inclusive of all taxes)</span>
   <div class="child3">
    <button class="cart">ADD to Cart</button>
    <button class="buy_it_now">Buy It Now</button>
    <button  class="back_to_home"onclick="window.location.href='index.html'">
    Back to Home
    </button>
   </div>
  </div>
    
`;

    const splideElement = document.querySelector(".splide");
    console.log(splideElement);

    const splide = new Splide(".splide", {
      type: "loop",
      perPage: 1,
      perMove: 1,
    });
    splide.mount();
  } catch (error) {
    console.log("error logged");
    console.error(error);
  }
}

// Get product ID from query parameters
const productId = getQueryParam("id");

// Check if on a product details page
if (productId) {
  fetchProductDetails(productId, ".product_container");
}

// if serach bar exists debounced
if (search) {
  search.addEventListener("input", debouncedFunction(searchAndDisplay, 1000));
}
