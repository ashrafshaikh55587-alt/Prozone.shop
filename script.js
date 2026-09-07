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


function showGateSignup(){document.querySelector('#authLoginFields').classList.add('hidden');document.querySelector('#authSignupFields').classList.remove('hidden');document.querySelector('#authTitle').textContent='Create your account';document.querySelector('#authSubtitle').textContent='Register first to access the store.'}
function showGateLogin(){document.querySelector('#authSignupFields').classList.add('hidden');document.querySelector('#authLoginFields').classList.remove('hidden');document.querySelector('#authTitle').textContent='Login to Prozone';document.querySelector('#authSubtitle').textContent='Login first to access the store.'}
function unlockSite(){document.querySelector('#authGate').classList.add('hidden')}
function gateSignup(){const name=document.querySelector('#gateSignupName').value.trim(),email=document.querySelector('#gateSignupEmail').value.trim(),pass=document.querySelector('#gateSignupPass').value;if(!name||!email||!pass)return toast('Please fill all fields');if(users.some(u=>u.email===email))return toast('Account already exists');users.push({name,email,pass});localStorage.setItem('prozone_users',JSON.stringify(users));localStorage.setItem('prozone_user',JSON.stringify({name,email}));unlockSite();setAccount();toast('Account created')}
function gateLogin(){const email=document.querySelector('#gateLoginEmail').value.trim(),pass=document.querySelector('#gateLoginPass').value,u=users.find(x=>x.email===email&&x.pass===pass);if(!u)return toast('Invalid email or password');localStorage.setItem('prozone_user',JSON.stringify({name:u.name,email:u.email}));unlockSite();setAccount();toast('Welcome back')}

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
function checkout(){if(!cart.length)return toast("Your cart is empty");closeModal("cartModal");document.querySelector("#payTotal").textContent="$"+cart.reduce((s,p)=>s+p.price,0);openModal("checkoutModal")}
function selectPayment(m,el){payment=m;document.querySelectorAll(".payment").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");document.querySelector("#wallet").textContent=wallets[m];document.querySelector("#paymentQr").src=m==="BTC"?"assets/btc-qr.png":"assets/ltc-qr.png"}
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
renderProducts();setAccount();updateCart();if(localStorage.getItem("prozone_user"))unlockSite();


/* Manual payment review flow */
function getManualOrders() {
  try { return JSON.parse(localStorage.getItem("prozone_manual_orders") || "[]"); }
  catch(e) { return []; }
}
function saveManualOrders(orders) {
  localStorage.setItem("prozone_manual_orders", JSON.stringify(orders));
}
function openPaymentSubmission(order) {
  const p = document.getElementById("paymentSubmission");
  if (!p) return;
  p.dataset.orderId = order && order.id ? order.id : ("ORD-" + Date.now());
  p.style.display = "block";
  p.scrollIntoView({behavior:"smooth", block:"center"});
}
function closePaymentSubmission() {
  const p = document.getElementById("paymentSubmission");
  if (p) p.style.display = "none";
}
function submitManualPayment() {
  const p = document.getElementById("paymentSubmission");
  const method = document.getElementById("paymentMethod")?.value;
  const txid = document.getElementById("paymentTxid")?.value.trim();
  if (!txid) {
    const s = document.getElementById("paymentSubmitStatus");
    if (s) s.textContent = "Please enter the TXID.";
    return;
  }
  const orders = getManualOrders();
  const order = {
    id: p?.dataset.orderId || ("ORD-" + Date.now()),
    user: localStorage.getItem("prozone_user") || "Guest",
    method, txid,
    amount: (window.currentCartTotal || 0),
    status: "Pending",
    createdAt: new Date().toISOString()
  };
  orders.unshift(order);
  saveManualOrders(orders);
  const s = document.getElementById("paymentSubmitStatus");
  if (s) s.textContent = "Submitted. Status: Pending admin review.";
  if (document.getElementById("paymentTxid")) document.getElementById("paymentTxid").value = "";
}
function openAdminPanel() {
  const p = document.getElementById("adminPanel");
  if (!p) return;
  p.style.display = "block";
  renderAdminOrders();
  p.scrollIntoView({behavior:"smooth", block:"center"});
}
function closeAdminPanel() {
  const p = document.getElementById("adminPanel");
  if (p) p.style.display = "none";
}
function renderAdminOrders() {
  const box = document.getElementById("adminOrders");
  if (!box) return;
  const orders = getManualOrders();
  if (!orders.length) {
    box.innerHTML = "<p>No payment submissions yet.</p>";
    return;
  }
  box.innerHTML = orders.map(o => `
    <div class="admin-order">
      <div><strong>${o.id}</strong> — ${o.method} — ${o.status}</div>
      <div>TXID: <code>${o.txid}</code></div>
      <div>User: ${o.user} | Amount: $${Number(o.amount||0).toFixed(2)}</div>
      ${o.status === "Pending" ? `
        <button class="btn primary" onclick="reviewManualOrder('${o.id}','Accepted')">Accept</button>
        <button class="btn secondary" onclick="reviewManualOrder('${o.id}','Rejected')">Reject</button>` : ""}
    </div>`).join("");
}
function reviewManualOrder(id, status) {
  const orders = getManualOrders();
  const i = orders.findIndex(o => o.id === id);
  if (i < 0) return;
  orders[i].status = status;
  orders[i].reviewedAt = new Date().toISOString();
  saveManualOrders(orders);
  renderAdminOrders();
}
