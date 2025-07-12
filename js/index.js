let token = localStorage.getItem("bt_auth_token");
let rememberDirect = localStorage.getItem("rememberRedirect");

if (rememberDirect) {
  window.location.href = "/dashboard.html";
}

if (token) {
  console.warn("validating token...");
  $.ajax({
    url: `${BASE_URL}/check-token`,
    type: "GET",
    headers: {
      Authorization: `${token}`,
    },
    success: function (response) {
      $("#alreadyLoggedModal").modal("show");
    },
    error: function () {
      alert("Token exist but not valid, please try to login again.");
    },
  });
}

$("#okRedirectBtn").on("click", function () {
  const remember = $("#rememberChoiceCheckbox").is(":checked");

  if (remember) {
    localStorage.setItem("rememberRedirect", "true");
  }

  window.location.href = "/dashboard.html";
});
