

class Cart {
    constructor(itemName, itemPrice, itemImage, itemQuantity) {
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemImage = itemImage;
        this.itemQuantity = itemQuantity;
    }
}

class UI {
    static displayCart() {
        const cart = document.querySelector(".offcanvas-body");
        cart.textContent ='';
        const cartItems = Store.getCart();
        console.log(cartItems);
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
                    <div class="row "><button type=button class="btn btn-success">Proceed to checkout</button></div>
                    `
                    cart.appendChild(buttonRow);
                }
    }

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
        console.log("adding: " + newCartItem.itemName + newCartItem.itemQuantity);
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
        console.log("click")
        console.log(e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.dataset.base64)
        //Get item value
        let itemName = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
        let itemPrice = e.target.parentElement.parentElement.firstElementChild.firstElementChild.textContent;
        let itemImage = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.dataset.base64;
        //instantiate new Cart Item
        let newCartItem = new Cart(itemName, itemPrice, itemImage, 1);
    
        //Add Cart Item to storage
        Store.addCart(newCartItem);

        //Add item to UI
        UI.displayCart();
    })
}









