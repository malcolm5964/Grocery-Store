

class Cart {
    constructor(itemName, itemPrice, itemImage, itemBrand, itemQuantity) {
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemImage = itemImage;
        this.itemBrand = itemBrand;
        this.itemQuantity = itemQuantity;
    }
}

class UI {

    //UI for displaying cart item when cart button is click
    static displayCart() {
        const cart = document.querySelector(".offcanvas-body");
        cart.textContent ='';
        const cartItems = Store.getCart();
        cartItems.forEach((cartItem) => UI.addItemToCart(cartItem));
        UI.displayCheckout()

        //Add eventlistner for delete button
        let cartDeleteBtn = document.querySelectorAll(".cartDeleteBtn");
        cartDeleteBtn.forEach((btn, index) => {
            cartDeleteBtn[index].addEventListener('click', e => {
                //Delete button event
                Store.deleteCartItem((e.target.parentElement.parentElement.children)[2].firstElementChild.firstElementChild.textContent)
                UI.deleteCartItem(e.target);
            })
        })



    }

    //UI for adding items into cart
    static addItemToCart(cartItem) {
        const cart = document.querySelector(".offcanvas-body");
        const row = document.createElement('div');
        row.className = "row align-items-center";

        row.innerHTML = `
        <div class="col-1 px-0 align-items-center"><button type="button" class="btn-close cartDeleteBtn"  aria-label="Close"></button></div>
        <div class="col-2 px-0 align-items-center"><img src="data:image/png;base64,${cartItem.itemImage}" width="65" height="65"></div>
        <div class="col-6 justify-content-center">
          <div class="row"><p class="mb-0">${cartItem.itemName}</p></div>
          <div class="row"><p class="mb-0 fw-bold" style="display:inline-block;">${cartItem.itemPrice}</p></div>
        </div>
        <div class="col-3 justify-content-center">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light px-1">-</button>
            <input class="border-0 text-center" type="text" value="${cartItem.itemQuantity}" maxlength="2" size="2" style="width: 50%; background-color: rgb(249, 249, 249);">
            <button type="button" class="btn btn-light px-1">+</button>
          </div>
        </div>
        `;
 
        cart.appendChild(row);
    }


    //display checkout button and price
    static displayCheckout() {
                const cartItems = Store.getCart();
                const cart = document.querySelector(".offcanvas-body");
                //Get total Price
                let totalPrice = 0
                cartItems.forEach((item, index) => {
                    totalPrice = totalPrice + (parseInt(((item.itemPrice).substring(1))) * parseInt(item.itemQuantity));
                    //totalPrice = totalPrice + (item.itemPrice * parseInt(item.itemQuantity));
                })
        
                //Display checkout button
                if(!cartItems === undefined || !cartItems.length == 0) {
                    const buttonRow = document.createElement('div');
                    buttonRow.className = "cartBtn row border-top border-bottom mt-5 py-2 ms-1"
                    buttonRow.innerHTML = `
                    <div class="row justify-content-between  mb-2"><p class="col fw-bold mb-0">Subtotal</p><p class="col fw-bold text-end mb-0 cartTotalPrice">$${totalPrice}</p></div>
                    <div class="row "><button type="button" class="btn btn-success" onclick="location.href='/checkout';">Proceed to checkout</button></div>
                    `
                    cart.appendChild(buttonRow);
                }
    }

    
    //UI for deleting item in cart
    static deleteCartItem(el) {
        el.parentElement.parentElement.remove()
        const cartItems = Store.getCart();
        let totalPrice = 0
        cartItems.forEach((item, index) => {
            totalPrice = totalPrice + (parseInt(((item.itemPrice).substring(1))) * parseInt(item.itemQuantity));
        })
        let cartTotalPrice = document.querySelector(".cartTotalPrice")
        cartTotalPrice.innerHTML = "$"+totalPrice
    }

    //To display items at checkout page
    static displayCheckoutPage() {
        const cartItems = Store.getCart();
        //Get total price
        let totalPrice = 0
        cartItems.forEach((item, index) => {
            totalPrice = totalPrice + (parseInt(((item.itemPrice).substring(1))) * parseInt(item.itemQuantity));
        })
        document.getElementById('totalPrice').innerHTML = "$" + totalPrice;

        cartItems.forEach((cartItem) => {

        const cart = document.querySelector("#checkoutContainer");
        const row = document.createElement('div');
        row.className = "row flex-nowrap py-4 border-bottom";

        row.innerHTML = `
        <div class="col"><img class="img-fluid" src="data:image/png;base64,${cartItem.itemImage}"></div>
        <div class="col-7">
            <h4>${cartItem.itemName}</h5>
            <p>By: ${cartItem.itemBrand}</p>
            <p class="text-success">In Stock</p>
            <p>Qty: ${cartItem.itemQuantity}</p>
        </div>
        <div class="col">
            <h5>${cartItem.itemPrice}</h5>
        </div>
        `;

        cart.appendChild(row)
        })




        
    }


    
}







class Store {

    static getCart() {
        let cartItems;
        if(localStorage.getItem('cartItems') === null) {
            cartItems = [];
        } else {
            cartItems = JSON.parse(localStorage.getItem('cartItems'));
        }
        
        return cartItems;
    }

    static addCart(newCartItem) {
        let cartItems = Store.getCart();
        let itemExist = cartItems.some(obj => obj.itemName === newCartItem.itemName);
        if(itemExist) {
            cartItems.forEach((item, index) => {
                if(item.itemName === newCartItem.itemName) {
                    item.itemQuantity = parseInt(item.itemQuantity) + parseInt(newCartItem.itemQuantity)
                    console.log(cartItems);
                    localStorage.setItem('cartItems', JSON.stringify(cartItems))
                }
            })
        } else {
            cartItems.push(newCartItem);
            console.log(cartItems);
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
        }

    }

    static deleteCartItem(itemName){
        const cartItems = Store.getCart();
        cartItems.forEach((item, index) => {
            if(item.itemName === itemName) {
                cartItems.splice(index, 1)
            }
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}

//Event: Add a item
let addBtn = document.querySelectorAll('.add_cart');
let cartBtn = document.querySelector('#cart_btn');

cartBtn.addEventListener('click', e => {
    UI.displayCart();
})


for(i=0; i < addBtn.length; i++) {
    addBtn[i].addEventListener('click', e => {
        //Get item value
        let itemName = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
        let itemPrice = e.target.parentElement.parentElement.firstElementChild.firstElementChild.textContent;
        let itemImage = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.dataset.base64;
        let itemBrand = (e.target.parentElement.parentElement.parentElement.children)[1].firstElementChild.textContent;
        //instantiate new Cart Item
        let newCartItem = new Cart(itemName, itemPrice, itemImage, itemBrand, 1);
    
        //Add Cart Item to storage
        Store.addCart(newCartItem);

        //Add item to UI
        UI.displayCart();
    })
}

//Event: Display checkout page

document.addEventListener('DOMContentLoaded', () => {
    if(document.body.classList.contains('checkout')) {
        console.log()
        UI.displayCheckoutPage();
    }
})









