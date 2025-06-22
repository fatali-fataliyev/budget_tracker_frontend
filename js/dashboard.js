function showNotification(message, type = "error") {
  const id = "notif-" + Date.now(); // unique-id
  const bgColor = type === "error" ? "#f44336" : "#4CAF50";
  const notification = $(`
    <div id="${id}" style="
      background-color: ${bgColor};
      color: white;
      padding: 12px 20px;
      margin-bottom: 10px;
      border-radius: 5px;
      font-family: sans-serif;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      transition: all 0.5s ease;
    ">
      ${message}
    </div>
    `);

  $("#notification-area").append(notification);

  setTimeout(() => {
    $(`#${id}`).fadeOut(500, function () {
      $(this).remove();
    });
  }, 3000);
}

$(document).ready(function () {
  $("#sidebar-toggle").on("click", function () {});

  // form submission:

  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    const username = $("#username").val();
    const password = $("#password").val();

    // send credentials to server:
    $.ajax({
      url: "http://localhost:8060/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ username, password }),
      success: function (response) {
        localStorage.setItem("bt_auth_token", response.extra);
        showNotification(response.message, "success");
        setTimeout(function () {
          window.location.href = "./dashboard.html";
        }, 800);
      },
      error: function (xhr) {
        const res = xhr.responseJSON;
        if (res.is_feedback) {
          showNotification("Sorry! Something went wrong.", "error");
        } else {
          showNotification(res.message, "error");
        }
      },
    });
  });
});
