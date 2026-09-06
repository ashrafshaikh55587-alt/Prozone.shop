const products=[
{name:"CC Code Card",price:20,was:39,tag:"CC"},
{name:"CC Code Card",price:50,was:99,tag:"CC"},
{name:"CC Code Card",price:100,was:199,tag:"CC"},
{name:"CC Code Card",price:200,was:399,tag:"CC"},
{name:"CC Code Card",price:300,was:599,tag:"CC"},
{name:"CC Code Card",price:400,was:799,tag:"CC"}
];
const wallets={
BTC:"bc1qjt3hpntl50fpzhtfup278rg0w4zqyrqpd8yx3j",
LTC:"ltc1qtmv09t68glpsqsg0a94euf546g2hzqxj6vdvs9"
};
let cart=[],payment="BTC",users=JSON.parse(localStorage.getItem("prozone_users")||"[]");

function renderProducts(){
 const q=(document.querySelector("#searchInput")?.value||"").toLowerCase();
 document.querySelector("#products").innerHTML=products.filter(p=>p.name.toLowerCase().includes(q)).map((p,i)=>`
 <article class="product"><div class="thumb">${p.tag}</div><div class="body">
 <span class="tag">${p.tag}</span><h3>${p.name}</h3>
 <div class="price">$${p.price} <del>$${p.was}</del></div>
 <button class="add" onclick="addToCart(${i})">Add to Cart</button></div></article>`).join("");
}
function addToCart(i){cart.push(products[i]);updateCart();toast("Added to cart")}
function updateCart(){
 document.querySelector("#cartCount").textContent=cart.length;
 document.querySelector("#cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cartrow"><span>${p.name}</span><b>$${p.price}</b><button onclick="cart.splice(${i},1);updateCart()">×</button></div>`).join(""):"<p class='muted'>Your cart is empty.</p>";
 document.querySelector("#cartTotal").textContent="$"+cart.reduce((s,p)=>s+p.price,0);
}
function openModal(id){document.querySelector("#"+id).classList.remove("hidden")}
function closeModal(id){document.querySelector("#"+id).classList.add("hidden")}
function openCart(){updateCart();openModal("cartModal")}
function checkout(){if(!cart.length)return toast("Your cart is empty");closeModal("cartModal");openModal("checkoutModal")}
function selectPayment(m,el){payment=m;document.querySelectorAll(".payment").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");document.querySelector("#wallet").textContent=wallets[m]}
function signup(){
 const name=document.querySelector("#signupName").value.trim(),email=document.querySelector("#signupEmail").value.trim(),pass=document.querySelector("#signupPass").value;
 if(!name||!email||!pass)return toast("Please fill all fields");
 if(users.some(u=>u.email===email))return toast("Account already exists");
 users.push({name,email,pass});localStorage.setItem("prozone_users",JSON.stringify(users));localStorage.setItem("prozone_user",JSON.stringify({name,email}));closeModal("signupModal");setAccount();toast("Account created")
}
function login(){
 const email=document.querySelector("#loginEmail").value.trim(),pass=document.querySelector("#loginPass").value,u=users.find(x=>x.email===email&&x.pass===pass);
 if(!u)return toast("Invalid email or password");
 localStorage.setItem("prozone_user",JSON.stringify({name:u.name,email:u.email}));closeModal("loginModal");setAccount();toast("Welcome back")
}
function setAccount(){
 const u=JSON.parse(localStorage.getItem("prozone_user")||"null"),el=document.querySelector("#account");
 el.textContent=u?`Hi, ${u.name}`:"Account";
 el.onclick=()=>u?(localStorage.removeItem("prozone_user"),setAccount(),toast("Logged out")):openModal("loginModal");
}
function toast(t){const x=document.querySelector("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
document.querySelector("#searchInput").addEventListener("input",renderProducts);
renderProducts();setAccount();updateCart();
