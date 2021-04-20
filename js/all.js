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
        console.log(response.data.carts)
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
                    <a href="#" class="material-icons">
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
        getCartList();

    })
        .catch(function (error) {
        console.log(error);
    })

})

