let token = localStorage.getItem("bt_auth_token");

if (token !== null) {
  window.location.href = "./dashboard.html";
}

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
    $(`#${id}`).fadeOut(300, function () {
      $(this).remove();
    });
  }, 2000);
}

$(document).ready(function () {
  $("#password-toggle").on("change", function () {
    $("#password").attr("type", this.checked ? "text" : "password");
  });

  // form submission:

  $("#reg-form").on("submit", function (e) {
    e.preventDefault();

    const username = $("#username").val();
    const fullname = $("#fullname").val();
    const password = $("#password").val();
    const email = $("#email").val();

    // send credentials to server:
    $.ajax({
      url: "http://localhost:8060/register",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ username, fullname, password, email }),
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
          console.log(res.message);
          showNotification(res.message, "error");
        }
      },
    });
  });
});

//Pure password strength checker from GeeksForGeeks | Source: https://www.geeksforgeeks.org/javascript/create-a-password-strength-checker-using-html-css-and-javascript/
let password = document.getElementById("password");
let power = document.getElementById("power-point");
password.oninput = function () {
  let point = 0;
  let value = password.value;
  let widthPower = ["1%", "25%", "50%", "75%", "100%"];
  let colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

  if (value.length >= 6) {
    let arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
    arrayTest.forEach((item) => {
      if (item.test(value)) {
        point += 1;
      }
    });
  }
  power.style.width = widthPower[point];
  power.style.backgroundColor = colorPower[point];
};
