
let productApi = 'http://localhost:3000/products'

function start() {
  getProduct(renderProducts);
  handleCreateForm();
  handleEditForm();
}

start();

// Function get list product
function getProduct(callback) {
  fetch(productApi)
    .then(response => response.json())
    .then(callback)
}

function createProduct(data, callback) {
  const uniqueId = Math.floor(Math.random() * 1000000).toString(); // Ví dụ tạo ID số ngẫu nhiên

  const newProduct = {
    ...data,
    id: uniqueId
  };

  fetch(productApi, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  }).then(response => response.json())
    .then(callback)
    .catch(error => console.error('Error:', error));
}
function deleteProduct(id) {
  fetch(`${productApi}/${id}`, {
    method: "DELETE",
  }).then(response => response.json())
    .then(function () {
      getProduct(renderProducts);
    })
    .catch(error => console.error('Error:', error));
}

function editProduct(id, data, callback) {
  fetch(`${productApi}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(callback)
    .catch(error => console.error('Error:', error));
}

function renderProducts(products) {
  const listProducts = document.querySelector('#list-products');
  const displayProducts = products.map(function (product) {
    return `
      <li>
      <h4>${product.title}</h4>
      <p>${product.description}</p>
      <p>${product.price}</p>
      <button onclick="showEditForm(${product.id}, '${product.title.replace(/'/g, "\\'")}', '${product.description.replace(/'/g, "\\'")}', ${product.price})">Edit</button>
      <button onclick="deleteProduct(${product.id})">Delete</button>
      </li>
    `
  });

  listProducts.innerHTML = displayProducts.join('');

}

function handleCreateForm() {
  const createBtn = document.querySelector('#create');

  createBtn.onclick = function () {
    const title = document.querySelector('.title').value;
    const description = document.querySelector('.description').value;
    const price = document.querySelector('.price').value;

    const formData = {
      title: title,
      description: description,
      price: price
    }

    createProduct(formData, function () {
      getProduct(renderProducts);
    });

  }
}

function showEditForm(id, title, description, price) {
  document.getElementById('editProductId').value = id;
  document.getElementById('editProductTitle').value = title;
  document.getElementById('editProductDescription').value = description;
  document.getElementById('editProductPrice').value = price;

  document.getElementById('editForm').style.display = 'block';
}

function handleEditForm() {
  const editForm = document.querySelector('#formEdit');
  editForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const id = document.getElementById('editProductId').value;
    const title = document.getElementById('editProductTitle').value;
    const description = document.getElementById('editProductDescription').value;
    const price = document.getElementById('editProductPrice').value;

    const updatedData = {
      title: title,
      description: description,
      price: price
    };

    editProduct(id, updatedData, function () {
      getProduct(renderProducts);
      document.getElementById('editForm').style.display = 'none';
    });
  });

  // Handle cancel button
  document.getElementById('cancelEdit').addEventListener('click', () => {
    document.getElementById('editForm').style.display = 'none';
  });
}
