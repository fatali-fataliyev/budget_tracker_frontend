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

if (!localStorage.getItem("bt_auth_token")) {
  window.location.href = "/login.html";
}

const DEL_ACCOUNT_URL = "http://localhost:8060/remove-account";
const DOWNLOAD_URL = "http://localhost:8060/download-user-data";

$.ajaxSetup({
  beforeSend: function (xhr) {
    const token = localStorage.getItem("bt_auth_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `${token}`);
    }
  },
});

$(document).ready(function () {
  // Trigger the modal
  $("#logout").on("click", function () {
    $("#logoutModal").modal("show");
  });

  // Confirm logout
  $("#confirmLogout").on("click", function () {
    $("#logoutModal").modal("hide");
    localStorage.removeItem("bt_auth_token");
    window.location.href = "/index.html";
  });

  //   Remove account modal
  $("#removeAccountBtn").on("click", function () {
    $("#removeAccountModal").modal("show");
  });

  // Toggle password visibility
  $(".toggle-password").on("click", function () {
    const input = $("#accountPassword");
    const icon = $(this).find("i");

    if (input.attr("type") === "password") {
      input.attr("type", "text");
      icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      input.attr("type", "password");
      icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });

  // Show another reason input
  $("#anotherReasonBtn").on("click", function () {
    $("#anotherReasonInput").removeClass("d-none").focus();
  });

  // Handle form submit
  $("#removeAccountForm").on("submit", function (e) {
    e.preventDefault();

    const password = $("#accountPassword").val().trim();
    const reason =
      $("#anotherReasonInput").val().trim() || $("#reasonSelect").val();

    if (!password || !reason) {
      showNotification("Please fill in all fields.", "error");
      return;
    }
    console.log("submitting data: ", password, reason);
    $.ajax({
      url: DEL_ACCOUNT_URL,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ password, reason }),
      success: function () {
        localStorage.removeItem("bt_auth_token");
        showNotification("Account removed successfully", "success");
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 1500);
      },
      error: function (error) {
        showNotification(error.responseJSON.message);
      },
    });
  });
});

// download data
$("#downloadDataBtn").on("click", function () {
  const token = localStorage.getItem("bt_auth_token");

  fetch(`${DOWNLOAD_URL}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        showNotification("Download failed");
        return;
      }

      const disposition = response.headers.get("Content-Disposition");
      let filename = "user_data.zip";

      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      return response.blob().then((blob) => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => {
      showNotification("Failed to download user data");
    });
});
