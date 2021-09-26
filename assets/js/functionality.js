let add_btn = document.querySelectorAll(".action-btn-add");
console.log(add_btn.length);
//localStorage.clear();


for(var i=0;i<add_btn.length;i++){
    add_btn[i].addEventListener('click',() =>{
        console.log("button clicked");
        cartNumbers();
    });
}

function cartdisplay(){
    let productNumber = localStorage.getItem('cartvalue');
    if(productNumber){
    document.querySelector('.cart-item span').textContent = productNumber;
    }
}

function cartNumbers(){
    //localStorage.setItem('cartvalue',1);
    let productNumber = localStorage.getItem('cartvalue');
    productNumber = parseInt(productNumber);
    //console.log(productNumber);

    if(productNumber){
        localStorage.setItem('cartvalue',productNumber + 1);
        document.querySelector('.cart-item span').textContent = productNumber + 1;
    }else{
        localStorage.setItem('cartvalue',1);
        document.querySelector('.cart-item span').textContent = 1; 
    }
    
}

cartdisplay();
    