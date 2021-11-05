let addToCart_btn = document.querySelectorAll(".action-btn-add");
console.log(addToCart_btn.length);
//localStorage.clear();


addToCart_btn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let product_detail = JSON.parse(btn.dataset.prod_detail);
        
        console.log(product_detail);
    })
})