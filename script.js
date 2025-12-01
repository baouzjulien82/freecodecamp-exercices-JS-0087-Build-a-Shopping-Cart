// Récupération des éléments du DOM nécessaires
const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false; // État d’affichage du panier (visible ou caché)

// Liste des produits disponibles
const products = [
  { id: 1, name: "Vanilla Cupcakes (6 Pack)", price: 12.99, category: "Cupcake" },
  { id: 2, name: "French Macaron", price: 3.99, category: "Macaron" },
  { id: 3, name: "Pumpkin Cupcake", price: 3.99, category: "Cupcake" },
  { id: 4, name: "Chocolate Cupcake", price: 5.99, category: "Cupcake" },
  { id: 5, name: "Chocolate Pretzels (4 Pack)", price: 10.99, category: "Pretzel" },
  { id: 6, name: "Strawberry Ice Cream", price: 2.99, category: "Ice Cream" },
  { id: 7, name: "Chocolate Macarons (4 Pack)", price: 9.99, category: "Macaron" },
  { id: 8, name: "Strawberry Pretzel", price: 4.99, category: "Pretzel" },
  { id: 9, name: "Butter Pecan Ice Cream", price: 2.99, category: "Ice Cream" },
  { id: 10, name: "Rocky Road Ice Cream", price: 2.99, category: "Ice Cream" },
  { id: 11, name: "Vanilla Macarons (5 Pack)", price: 11.99, category: "Macaron" },
  { id: 12, name: "Lemon Cupcakes (4 Pack)", price: 12.99, category: "Cupcake" },
];

// Génération dynamique des cartes produits dans la page
products.forEach(({ name, id, price, category }) => {
  dessertCards.innerHTML += `
    <div class="dessert-card">
      <h2>${name}</h2>
      <p class="dessert-price">$${price}</p>
      <p class="product-category">Category: ${category}</p>
      <button id="${id}" class="btn add-to-cart-btn">Add to cart</button>
    </div>
  `;
});

// Classe représentant le panier
class ShoppingCart {
  constructor() {
    this.items = []; // Tableau des produits ajoutés
    this.total = 0;  // Total TTC
    this.taxRate = 8.25; // Taux de taxe en %
  }

  // Ajout d’un produit au panier
  addItem(id, products) {
    const product = products.find((item) => item.id === id); // Recherche du produit par ID
    const { name, price } = product;
    this.items.push(product); // Ajout du produit dans le tableau

    // Calcul du nombre d’exemplaires par produit
    const totalCountPerProduct = {}; // on créé un objet vide
    this.items.forEach((dessert) => {
      totalCountPerProduct[dessert.id] = (totalCountPerProduct[dessert.id] || 0) + 1; // on assigne la paire clef valeur id : 0 + 1 si première fois ou id : n + 1 si n fois
    });
    // version avec reduce()
    /* const totalCountPerProduct = this.items.reduce((acc, dessert) => {
          acc[dessert.id] = (acc[dessert.id] || 0) + 1;
          return acc;
        }, {}); */

    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`);

    // Si le produit est déjà présent, on met à jour le compteur
    currentProductCount > 1
      ? currentProductCountSpan.textContent = `${currentProductCount}x`
      : productsContainer.innerHTML += `
        <div id="dessert${id}" class="product">
          <p>
            <span class="product-count" id="product-count-for-id${id}"></span>${name}
          </p>
          <p>${price}</p>
        </div>
      `;
  }

  // Retourne le nombre total d’articles dans le panier
  getCounts() {
    return this.items.length;
  }

  // Vide le panier
  clearCart() {
    if (!this.items.length) {
      alert("Your shopping cart is already empty");
      return;
    }

    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );

    if (isCartCleared) {
      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  // Calcule les taxes sur un montant donné
  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  // Calcule le total (sous-total + taxes)
  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;

    // Mise à jour de l’affichage
    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;

    return this.total;
  }
};

// Création d’une instance du panier
const cart = new ShoppingCart();

// Récupération des boutons "Add to cart"
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

// Ajout d’un écouteur sur chaque bouton "Add to cart"
[...addToCartBtns].forEach((btn) => {
  btn.addEventListener("click", (event) => {
    cart.addItem(Number(event.target.id), products); // Ajout du produit
    totalNumberOfItems.textContent = cart.getCounts(); // Mise à jour du compteur
    cart.calculateTotal(); // Mise à jour du total
  });
});

// Gestion du bouton pour afficher/masquer le panier
cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

// Gestion du bouton pour vider le panier
clearCartBtn.addEventListener("click", cart.clearCart.bind(cart)); // ici, .bind(cart) permet de rester dans le contexte de cart et ne pas perdre les référence de this dans l'objet.
