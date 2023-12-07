document.addEventListener("DOMContentLoaded", function () {
    const baseUrl = 'https://food-boutique.b.goit.study/api';
  
    const defaultFilters = {
      keyword: null,
      category: null,
      page: 1,
      limit: 6,
      sorted: 'asc',
    };
  
    let filters = JSON.parse(localStorage.getItem("filters")) || { ...defaultFilters };
  
    const searchForm = document.getElementById("searchForm");
    const keywordInput = document.getElementById("keyword");
    const categorySelect = document.getElementById("category");
    const sortedSelect = document.getElementById("sorted");
    const productsTable = document.getElementById("productsTable");
  
    initializePage();
  
    async function initializePage() {
      await fetchProducts(filters);
      fetchCategories();
    }
  
    searchForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      updateFilters();
      await fetchProducts(filters);
    });
  
    async function fetchCategories() {
      try {
        const categories = await getCategories();
        populateCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
  
    async function getCategories() {
      const categoriesResponse = await fetch(`${baseUrl}/products/categories`);
      return await categoriesResponse.json();
    }
  
    function populateCategories(categories) {
      categorySelect.innerHTML = "";
      const showAllOption = createOption("Show all", "Show all");
      categorySelect.appendChild(showAllOption);
  
      categories.forEach(category => {
        const option = createOption(category, category);
        categorySelect.appendChild(option);
      });
    }
  
    function createOption(value, text) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      return option;
    }
  
    async function fetchProducts(filters) {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${baseUrl}/products?${queryString}`;
  
      try {
        const products = await fetchData(url);
        renderProductsTable(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    async function fetchData(url) {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    }
  
    function renderProductsTable(products) {
      productsTable.innerHTML = '';
      const tableBody = document.createElement('tbody');
  
      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.price}</td>
        `;
        tableBody.appendChild(row);
      });
  
      productsTable.appendChild(tableBody);
    }
  
    function updateFilters() {
      filters = {
        keyword: keywordInput.value,
        category: categorySelect.value === "Show all" ? null : categorySelect.value,
        page: 1,
        limit: 6,
        sorted: sortedSelect.value
      };
      localStorage.setItem("filters", JSON.stringify(filters));
    }
  });
  