let productData = [];

init();

function init(){
    getProductList();
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
                <a href="#" id="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT${item.origin_price}</del>
                <p class="nowPrice">NT${item.price}</p>
            </li>`
    })
    productList.innerHTML = str;
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
                <a href="#" id="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT${item.origin_price}</del>
                <p class="nowPrice">NT${item.price}</p>
            </li>`
        }
    })
    productList.innerHTML = str;
})