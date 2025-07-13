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

let token = localStorage.getItem("bt_auth_token");

if (!token) {
  window.location.href = "/login.html";
} else {
  $.ajax({
    url: `${BASE_URL}/check-token`,
    type: "GET",
    headers: {
      Authorization: `${token}`,
    },
    success: function (response) {
      console.log("token is valid");
    },
    error: function () {
      localStorage.removeItem("bt_auth_token");
      localStorage.removeItem("rememberRedirect");
      showNotification("Please login again.");
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1000);
      return;
    },
  });
}

$.ajaxSetup({
  beforeSend: function (xhr) {
    const token = localStorage.getItem("bt_auth_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `${token}`);
    }
  },
});

$(document).ready(function () {
  $.ajax({
    url: `${BASE_URL}/statistics/expense`,
    type: "GET",
    success: function (data) {
      const labels = ["1000+", "500–1000", "Under 500"];
      const values = [
        data.more_than_1000,
        data.between_500_and_1000,
        data.less_than_500,
      ];

      createDonut("expense-donut", labels, values, [
        "#E63946",
        "#457B9D",
        "#F1FAEE",
      ]);
    },
    error: function (err) {
      const message = err.responseJSON?.message || "Error occurred";
      showNotification(message);

      let isAuthErr = err.responseJSON?.code === "UNAUTHORIZED";
      if (isAuthErr) {
        console.warn("Auth error!");
        localStorage.removeItem("bt_auth_token");
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 5000);
      }
    },
  });

  $.ajax({
    url: `${BASE_URL}/statistics/income`,
    type: "GET",
    success: function (data) {
      const labels = ["1000+", "500-1000", "Under 500"];
      const values = [
        data.more_than_1000,
        data.between_500_and_1000,
        data.less_than_500,
      ];

      createDonut("income-donut", labels, values, [
        "#ff6384",
        "#36a2eb",
        "#ffce56",
      ]);
    },
    error: function (err) {
      const message = err.responseJSON?.message || "Error occurred";
      showNotification(message);

      let isAuthErr = err.responseJSON?.code === "UNAUTHORIZED";
      if (isAuthErr) {
        console.warn("Auth error!");
        localStorage.removeItem("bt_auth_token");
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 5000);
      }
    },
  });

  $.ajax({
    url: `${BASE_URL}/statistics/transaction`,
    type: "GET",
    success: function (data) {
      const labels = ["Expenses", "Incomes"];
      const values = [data.expenses, data.incomes];

      createDonut("txn-donut", labels, values, ["#E76F51", "#2A9D8F"]);
    },
    error: function (err) {
      const message = err.responseJSON?.message || "Error occurred";
      showNotification(message);

      let isAuthErr = err.responseJSON?.code === "UNAUTHORIZED";
      if (isAuthErr) {
        console.warn("Auth error!");
        localStorage.removeItem("bt_auth_token");
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 5000);
      }
    },
  });

  //Statistics donut

  function createDonut(id, label, data, colors) {
    const ctx = document.getElementById(id).getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: label,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Logout

  $("#logout").on("click", function (e) {
    e.preventDefault();
    $("#logoutModal").modal("show");
  });

  $("#confirmLogout").on("click", function () {
    $("#logoutModal").modal("hide");
    localStorage.removeItem("bt_auth_token");
    localStorage.removeItem("rememberRedirect");
    window.location.href = "/index.html";
  });
});
