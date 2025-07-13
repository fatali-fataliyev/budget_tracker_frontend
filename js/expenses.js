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

function updateCategories(categories) {
  if (categories.length === 0) {
    showNotification("No results found");
    return;
  }

  const $container = $("#categories");
  $container.empty();

  categories.forEach((cat) => {
    const isExpired = cat.is_expired;
    const usagePercent = cat.usage_percent;

    const card = `
        <div class="category-card">
          ${
            isExpired
              ? `<div class="expired-stamp"><img src="../images/items/expired_stamp.png" alt="Expired Stamp" /></div>`
              : ""
          }

          <div class="d-flex justify-content-between mb-4">
            <h4 class="category-name toggle-text" id="category-name">${
              cat.name
            }</h4>
            <div class="d-flex justify-content-between">
              <div title="Expire days" class="me-4">
                <i class="fa-solid fa-calendar-days"></i>
                <span class="category-days">${cat.period_day}</span>
              </div>
              <div title="Maxiumum Amount" class="me-4">
                <i class="fa-solid fa-chart-simple"></i>
                <span class="category-max">${cat.max_amount}</span>
              </div>
              <div title="Amount">
                <i class="fa-solid fa-dollar-sign"></i>
                <span class="category-amount">${cat.amount}</span>
              </div>
            </div>
          </div>

          <div class="progress mb-1">
            <div class="progress-bar ${getUsagePercentColor(usagePercent)}" 
              style="width: ${usagePercent}%;"
            >
              <span style="color: white; font-weight: bold; font-size:14px">${usagePercent}%</span>
            </div>
          </div>

          <div class="mt-3">
            <p class="text-muted mb-0 toggle-text category-note" id="note">${
              cat.note || "No note."
            }</p>
          </div>

          <hr />

          <div class="d-flex flex-column align-items-end gap-1 mt-3 me-2 text-muted small">
            <div>
              <i class="fa-regular fa-clock me-1"></i>
              <span class="category-created-at">${new Date(
                cat.created_at
              ).toLocaleString()}</span>
            </div>
            <div>
              <i class="fa-solid fa-pen me-1"></i>
              <span class="category-updated-at">${new Date(
                cat.updated_at
              ).toLocaleString()}</span>
            </div>
          </div>

          <div class="d-flex flex-column align-items-end gap-1 mt-3 me-2 text-muted small">
            <div class="d-flex gap-2">
              <button class="icon-btn text-success edit-btn" id="edit" title="Edit" data-cid="${
                cat.id
              }">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="icon-btn text-danger" id="delete" title="Delete" data-cid="${
                cat.id
              }">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;

    $container.append(card);
  });
}

const EXP_URL = "category/expense";

function getCategories() {
  $.ajax({
    url: `${BASE_URL}${EXP_URL}`,
    type: "GET",
    success: function (data) {
      const categories = data.categories;
      const $container = $("#categories");
      $container.empty();

      categories.forEach((cat) => {
        const isExpired = cat.is_expired;
        const usagePercent = cat.usage_percent;

        const card = `
        <div class="category-card">
          ${
            isExpired
              ? `<div class="expired-stamp"><img src="../images/items/expired_stamp.png" alt="Expired Stamp" /></div>`
              : ""
          }

          <div class="d-flex justify-content-between mb-4">
            <h4 class="category-name toggle-text" id="category-name">${
              cat.name
            }</h4>
            <div class="d-flex justify-content-between">
              <div title="Expire days" class="me-4">
                <i class="fa-solid fa-calendar-days"></i>
                <span class="category-days">${cat.period_day}</span>
              </div>
              <div title="Maxiumum Amount" class="me-4">
                <i class="fa-solid fa-chart-simple"></i>
                <span class="category-max">${cat.max_amount}</span>
              </div>
              <div title="Amount">
                <i class="fa-solid fa-dollar-sign"></i>
                <span class="category-amount">${cat.amount}</span>
              </div>
            </div>
          </div>

          <div class="progress mb-1">
            <div class="progress-bar ${getUsagePercentColor(usagePercent)}" 
              style="width: ${usagePercent}%;"
            >
              <span style="color: white; font-weight: bold; font-size:14px">${usagePercent}%</span>
            </div>
          </div>

          <div class="mt-3">
            <p class="text-muted mb-0 toggle-text category-note" id="note">${
              cat.note || "No note."
            }</p>
          </div>

          <hr />

          <div class="d-flex flex-column align-items-end gap-1 mt-3 me-2 text-muted small">
            <div>
              <i class="fa-regular fa-clock me-1"></i>
              <span class="category-created-at">${new Date(
                cat.created_at
              ).toLocaleString()}</span>
            </div>
            <div>
              <i class="fa-solid fa-pen me-1"></i>
              <span class="category-updated-at">${new Date(
                cat.updated_at
              ).toLocaleString()}</span>
            </div>
          </div>

          <div class="d-flex flex-column align-items-end gap-1 mt-3 me-2 text-muted small">
            <div class="d-flex gap-2">
              <button class="icon-btn text-success edit-btn" id="edit" title="Edit" data-cid="${
                cat.id
              }">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="icon-btn text-danger" id="delete" title="Delete" data-cid="${
                cat.id
              }">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;

        $container.append(card);
        //Toggle-text
      });
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
}

function getUsagePercentColor(percent) {
  if (percent >= 90) {
    return "bg-danger";
  } else if (percent >= 60) {
    return "bg-warning";
  } else {
    return "bg-success";
  }
}

$(document).ready(function () {
  const $img = $(".expired-stamp img");
  $img.on("click touchstart", function () {
    $(this).css("opacity", "0");
  });

  // Load exist categories
  getCategories();

  // Add category

  $("#addCategoryForm").on("submit", function (e) {
    e.preventDefault();

    const newCategory = {
      name: $("#categoryName").val(),
      max_amount: parseFloat($("#maxAmount").val(), 10),
      period_day: parseInt($("#periodDay").val(), 10),
      note: $("#categoryNote").val(),
    };

    console.log("Adding new category:", newCategory);

    $.ajax({
      url: `${BASE_URL}${EXP_URL}`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(newCategory),
      success: function (response) {
        showNotification(response.message, "success");
        getCategories();
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addCategoryModal")
        );
        modal.hide();
        $("#addCategoryForm")[0].reset();
      },
      error: function (err) {
        console.log(err);
        showNotification(err.responseJSON?.message || "Failed");
      },
    });
  });

  // Get filtered categories
  $("#filterForm").on("submit", function (e) {
    e.preventDefault();

    const filterData = {
      names: $("#names").val(),
      max_amount: $("#max_amount").val(),
      period_day: $("#period_day").val(),
      created_at: $("#created_at").val(),
      end_date: $("#end_date").val(),
    };

    const queryString = new URLSearchParams(filterData).toString();

    $.get(`${BASE_URL}${EXP_URL}?${queryString}`, function (data) {
      updateCategories(data.categories);
    }).fail(function (error) {
      showNotification(error.responseJSON.message);
    });

    console.log("Filter values:", filterData);
    $("#filterModal").modal("hide");
  });

  // Delete category

  let selectedCategoryId = null;

  $(document).on("click", "#delete", function () {
    selectedCategoryId = $(this).data("cid");
    $("#deleteConfirmModal").modal("show");
  });

  $("#confirmDeleteBtn").on("click", function () {
    if (selectedCategoryId) {
      $.ajax({
        url: `${BASE_URL}${EXP_URL}/${selectedCategoryId}`,
        method: "DELETE",
        success: function (response) {
          showNotification(response.message, "success");
          $(`[data-cid="${selectedCategoryId}"]`)
            .closest(".category-card")
            .remove();
          $("#deleteConfirmModal").modal("hide");
          selectedCategoryId = null;
        },
        error: function (error) {
          showNotification(error.responseJSON.message);
        },
      });
    } else {
      showNotification("Failed");
    }
  });

  // Edit category

  let currentEditCategoryId = null;

  $(document).on("click", "#edit", function () {
    const $card = $(this).closest(".category-card");
    currentEditCategoryId = $(this).data("cid");

    $("#editCategoryId").val(currentEditCategoryId);
    const categoryName = $(this)
      .closest(".category-card")
      .find(".category-name")
      .text()
      .trim();
    console.log(categoryName);

    $("#editName").val(categoryName);
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

    $.ajax({
      url: `${BASE_URL}${EXP_URL}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedCategory),
      success: function (response) {
        const updatedCategory = response.categories[0];

        if (!updatedCategory) {
          showNotification("Failed");
          return;
        }

        const $card = $(`[data-cid="${currentEditCategoryId}"]`).closest(
          ".category-card"
        );

        console.log("Updating card for ID:", currentEditCategoryId);

        $card.find(".category-name").text(updatedCategory.name);
        $card.find(".category-amount").text(`${updatedCategory.amount}`);
        $card.find(".category-max").text(`${updatedCategory.max_amount}`);
        $card.find(".category-days").text(`${updatedCategory.period_day}`);
        $card.find(".category-note").text(updatedCategory.note);
        $card
          .find(".progress-bar")
          .addClass(getUsagePercentColor(updatedCategory.usage_percent));
        $card
          .find(".progress-bar")
          .css("width", `${updatedCategory.usage_percent}%`)
          .text(`${updatedCategory.usage_percent}%`);

        if (updatedCategory.is_expired) {
          $card.find(".expired-stamp").show();
        } else {
          $card.find(".expired-stamp").hide();
        }

        $card
          .find(".category-created-at")
          .text(
            `Created: ${new Date(updatedCategory.created_at).toLocaleString()}`
          );
        $card
          .find(".category-updated-at")
          .text(
            `Edited: ${new Date(updatedCategory.updated_at).toLocaleString()}`
          );

        console.log(response);
        showNotification("Updated", "success");
        currentEditCategoryId = null;
      },
      error: function (error) {
        showNotification(error.responseJSON.message);
      },
    });

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
    localStorage.removeItem("rememberRedirect");
    window.location.href = "/index.html";
  });
});
