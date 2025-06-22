let token = localStorage.getItem("bt_auth_token");

if (token !== null) {
  window.location.href = "./dashboard.html";
}
