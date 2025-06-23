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

$.ajaxSetup({
  beforeSend: function (xhr) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `${token}`);
    }
  },
});

$(document).ready(function () {
  if (!localStorage.getItem("bt_auth_token")) {
    window.location.href = "/login.html";
  }

  const createDonut = (id, label, data, colors) => {
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
  };

  createDonut(
    "donut1",
    ["1000+", "500+", "<500"],
    [3, 2, 1],
    ["#ff6384", "#36a2eb", "#ffce56"]
  );
  createDonut(
    "donut2",
    ["1000+", "500+", "<500"],
    [1, 2, 3],
    ["#4bc0c0", "#9966ff", "#ff9f40"]
  );
  createDonut(
    "donut3",
    ["Incomes", "Expenses"],
    [70, 30],
    ["#00c853", "#d50000"]
  );

  // Logout

  $("#logout").on("click", function (e) {
    e.preventDefault();
    $("#logoutModal").modal("show");
  });

  $("#confirmLogout").on("click", function () {
    $("#logoutModal").modal("hide");
    localStorage.removeItem("bt_auth_token");
    window.location.href = "/index.html";
  });
});
