let productData = [];
let cartData  = [];

init();

function init(){
    getProductList();
    getCartList();
}

function getProductList(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`)
        .then(function (response) {
        console.log(response.data.products);
        productData = response.data.products;
        renderProducts();
    })
        .catch(function (error) {
        console.log(error);
    })
}

function renderProducts() {
    let str = "";
    productData.forEach(function(item){
        str += `
            <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" id="addCardBtn" class="js-addCart" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT${item.origin_price}</del>
                <p class="nowPrice">NT${item.price}</p>
            </li>`
    })
    productList.innerHTML = str;
}


function getCartList(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
        .then(function (response) {
        console.log(response.data)
        cartListTotal.textContent = response.data.finalTotal;
        cartData = response.data.carts;
        let str = "";
        cartData.forEach(function(item){
            str += `
            <tr>
                <td>
                    <div class="cardItem-title">
                        <img src="${item.product.images}" alt="">
                        <p>${item.product.title}</p>
                    </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>NT$${item.product.price * item.quantity}</td>
                <td class="discardBtn">
                    <a href="#" class="material-icons" data-id="${item.id}">
                        clear
                    </a>
                </td>
            </tr>
            `
        });
        cartList.innerHTML = str;
    })
        .catch(function (error) {
        console.log(error);
    })
}


productSelect.addEventListener("change", function(e){
    console.log(e.target.value);
    if(e.target.value == "全部"){
        renderProducts();
    }
    let str = "";
    productData.forEach(function(item){
        if(item.category == e.target.value){
            str += `
                <li class="productCard">
                    <h4 class="productType">新品</h4>
                    <img src="${item.images}" alt="">
                    <a href="#" id="addCardBtn" class="js-addCart" data-id="${item.id}">加入購物車</a>
                    <h3>${item.title}</h3>
                    <del class="originPrice">NT${item.origin_price}</del>
                    <p class="nowPrice">NT${item.price}</p>
                </li>`
        }
    })
    productList.innerHTML = str;
})


productList.addEventListener("click", function(e){
    console.log(e.target.nodeName);
    e.preventDefault(); // 不讓一直跳到最上面
    if(e.target.nodeName !== "A"){
        e.preventDefault();
        // alert("您沒點擊到加入購物車")
        return
    }
    let productId = e.target.getAttribute("data-id");
    let numCheck = 1;
    // 當物品重複的時候，先去比較有沒有重複點擊的品項，有的話 + 1，沒有的話直接去發送
    cartData.forEach(function(item){
        if(item.product.id === productId){
            numCheck = item.quantity += 1;
        }
    })

    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,
    {
        "data": {
            "productId": productId,
            "quantity": numCheck
        }
    }).then(function (response) {
        console.log(response);
        alert("加入購物車成功")
        getCartList()

    })
        .catch(function (error) {
        console.log(error);
    })

})

cartList.addEventListener("click", function(e){
    e.preventDefault();
    const cartId = e.target.getAttribute("data-id");
    console.log(cartId)
    if(cartId == null){
        return;
    }   
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function (response) {
        console.log(response);
        alert("刪除成功")
        getCartList()

    })
        .catch(function (error) {
        console.log(error);
    })
})

discardAllBtn.addEventListener("click", function(e){
    console.log(e.target)
    e.preventDefault();
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
    .then(function (response) {
        console.log(response);
        alert("購物車全部刪除成功")
        getCartList()

    })
        .catch(function (error) {
        console.log(error);
    })
})

orderInfo.addEventListener("click", function(e){
    e.preventDefault();
    console.log("你被點擊了")
    if(cartData.length == 0){
        alert("請加入購物車")
        return
    }
    const customerName = document.querySelector("#customerName").value;
    const customerPhone = document.querySelector("#customerPhone").value;
    const customerEmail = document.querySelector("#customerEmail").value;
    const customerAddress = document.querySelector("#customerAddress").value;
    const customerTradeWay = document.querySelector("#tradeWay").value;
    console.log(customerName, customerPhone, customerEmail, customerAddress, customerTradeWay)
    if(customerName =="" || customerPhone =="" || customerEmail =="" || customerAddress ==""){
        alert("請輸入訂單資訊");
        return;
    }
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/orders`,{
        "data": {
            "user": {
                "name": customerName,
                "tel": customerPhone,
                "email": customerEmail,
                "address": customerAddress,
                "payment": customerTradeWay
            }
        }
    }).then(function (response) {
        console.log(response);
        alert("訂單建立成功")
        document.querySelector("#customerName").value = "";
        document.querySelector("#customerPhone").value = "";
        document.querySelector("#customerEmail").value = "";
        document.querySelector("#customerAddress").value = "";
        document.querySelector("#tradeWay").value = "ATM";
        getCartList();
    })
        .catch(function (error) {
        console.log(error);
    })
})
