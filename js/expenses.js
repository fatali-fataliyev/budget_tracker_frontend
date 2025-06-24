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

$.ajaxSetup({
  beforeSend: function (xhr) {
    const token = localStorage.getItem("bt_auth_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `${token}`);
    }
  },
});

const URL = "http://localhost:8060/category/expense";

$(document).ready(function () {
  $.ajax({
    url: URL,
    type: "GET",
    success: function (data) {
      console.log(data.categories);
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

  //Toggle-text

  document.querySelectorAll(".toggle-text").forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.toggle("expanded");
    });
  });

  // Delete category

  let selectedCategoryId = null;

  $(document).on("click", "#delete", function () {
    selectedCategoryId = $(this).data("cid");
    $("#deleteConfirmModal").modal("show");
  });

  $("#confirmDeleteBtn").on("click", function () {
    console.log("deleting: ", selectedCategoryId);
    // if (selectedCategoryId) {
    //   console.log("Deleting category ID:", selectedCategoryId);

    //   // Your AJAX or delete logic here:
    //   // $.ajax({ url: `/api/delete/${selectedCategoryId}`, method: 'DELETE' });

    //   // Optionally remove card from DOM
    //   $(`[data-cid="${selectedCategoryId}"]`)
    //     .closest(".category-card")
    //     .remove();

    //   $("#deleteConfirmModal").modal("hide");
    //   selectedCategoryId = null;
    // }
  });

  // Edit category

  let currentEditCategoryId = null;

  $(document).on("click", "#edit", function () {
    const $card = $(this).closest(".category-card");
    currentEditCategoryId = $(this).data("cid");

    $("#editCategoryId").val(currentEditCategoryId);
    $("#editName").val($("#category-name").text().trim());
    $("#editMaxAmount").val(
      $card.find('[title="Maxiumum Amount"] span').text().trim()
    );
    $("#editPeriodDay").val(
      $card.find('[title="Expire days"] span').text().trim()
    );
    $("#editNote").val($card.find("#note").text().trim());
    $("#editCategoryModal").modal("show");
  });

  $("#editCategoryForm").on("submit", function (e) {
    e.preventDefault();

    const updatedCategory = {
      id: $("#editCategoryId").val(),
      new_name: $("#editName").val(),
      new_max_amount: parseFloat($("#editMaxAmount").val()),
      new_period_day: parseInt($("#editPeriodDay").val(), 10),
      new_note: $("#editNote").val(),
    };

    console.log("Submitting edited category:", updatedCategory);
    let oldName = $("#category-name").text().trim().toLowerCase();
    let newName = updatedCategory.new_name.toLowerCase();

    if (oldName === newName) {
      showNotification("Please enter a new name.");
      return;
    }

    // TODO: replace this with actual AJAX call
    // $.ajax({
    //   url: '/api/edit-category',
    //   method: 'POST',
    //   contentType: 'application/json',
    //   data: JSON.stringify(updatedData),
    //   success: function (res) {
    //     alert('Updated!');
    //     $('#editCategoryModal').modal('hide');
    //     // Optionally: reload page or update UI
    //   }
    // });

    $("#editCategoryModal").modal("hide");
  });

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
