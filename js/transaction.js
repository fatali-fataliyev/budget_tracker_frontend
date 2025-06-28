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

const TXN_POST_GET_URL = "http://localhost:8060/transaction";
const IMG_TO_TXN_URL = "http://localhost:8060/image-process";
const INCOMES_GET_URL = "http://localhost:8060/category/income";
const EXPENSES_GET_URL = "http://localhost:8060/category/expense";

$.ajaxSetup({
  beforeSend: function (xhr) {
    const token = localStorage.getItem("bt_auth_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `${token}`);
    }
  },
});

function updateTransactions(transactions) {
  if (transactions.length === 0) {
    showNotification("No results found");
    return;
  }

  console.log("filtered transcations: ", transactions);

  const $container = $("#transactions");
  $container.empty();

  transactions.forEach((txn) => {
    const card = `
            <div class="card shadow-sm rounded-4 p-3 mb-3 w-100">
                <div class="card-body">
                    <!-- First row -->
                    <div class="row gy-2 align-items-center">
                    <!-- Icon -->
                    <div class="col-6 col-md-2 text-center">
                        <i class="fas fa-money-check-alt fa-2x text-success"></i>
                        <div class="small text-muted">Transaction</div>
                    </div>

                    <!-- Category -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-tag me-1 text-primary"></i>
                        <strong>Category:</strong><br>
                        <span class="text-muted">${txn.category_name}</span>
                    </div>

                    <!-- Type -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-th-large me-1 text-info"></i>
                        <strong>Type:</strong><br>
                        <span class="text-muted">
                        ${txn.category_type === "+" ? "Income" : "Expense"}
                        </span>
                    </div>

                    <!-- Amount -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-coins me-1 text-warning"></i>
                        <strong>Amount:</strong><br>
                        <span class="text-muted">${txn.amount}</span>
                    </div>

                    <!-- Currency -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-right-left me-1 text-warning"></i>
                        <strong>Currency:</strong><br>
                        <span class="text-muted">${txn.currency}</span>
                    </div>

                    <!-- Date -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-calendar-alt me-1 text-secondary"></i>
                        <strong>Date:</strong><br>
                        <span class="text-muted">${new Date(
                          txn.created_at
                        ).toLocaleString()}</span>
                    </div>
                    </div>

                    <!-- Second row: Note -->
                    <div class="row mt-3">
                    <div class="col" style="margin-top:20px;">
                        <i class="fas fa-sticky-note me-1 text-dark"></i>
                        <strong>Note:</strong>
                        <span class="text-muted">${
                          txn.note || "No note provided"
                        }</span>
                    </div>
                    </div>
                </div>
             </div> 
        `;
    $container.append(card);
  });
}

function getTransactions() {
  $.ajax({
    url: `${TXN_POST_GET_URL}`,
    type: "GET",
    success: function (data) {
      const transactions = data.transactions;
      const $container = $("#transactions");
      $container.empty();

      transactions.forEach((txn) => {
        const card = `
            <div class="card shadow-sm rounded-4 p-3 mb-3 w-100">
                <div class="card-body">
                    <!-- First row -->
                    <div class="row gy-2 align-items-center">
                    <!-- Icon -->
                    <div class="col-6 col-md-2 text-center">
                        <i class="fas fa-money-check-alt fa-2x text-success"></i>
                        <div class="small text-muted">Transaction</div>
                    </div>

                    <!-- Category -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-tag me-1 text-primary"></i>
                        <strong>Category:</strong><br>
                        <span class="text-muted">${txn.category_name}</span>
                    </div>

                    <!-- Type -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-th-large me-1 text-info"></i>
                        <strong>Type:</strong><br>
                        <span class="text-muted">
                        ${txn.category_type === "+" ? "Income" : "Expense"}
                        </span>
                    </div>

                    <!-- Amount -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-coins me-1 text-warning"></i>
                        <strong>Amount:</strong><br>
                        <span class="text-muted">${txn.amount}</span>
                    </div>

                    <!-- Currency -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-right-left me-1 text-warning"></i>
                        <strong>Currency:</strong><br>
                        <span class="text-muted">${txn.currency}</span>
                    </div>

                    <!-- Date -->
                    <div class="col-6 col-md-2">
                        <i class="fas fa-calendar-alt me-1 text-secondary"></i>
                        <strong>Date:</strong><br>
                        <span class="text-muted">${new Date(
                          txn.created_at
                        ).toLocaleString()}</span>
                    </div>
                    </div>

                    <!-- Second row: Note -->
                    <div class="row mt-3">
                    <div class="col" style="margin-top:20px;">
                        <i class="fas fa-sticky-note me-1 text-dark"></i>
                        <strong>Note:</strong>
                        <span class="text-muted">${
                          txn.note || "No note provided"
                        }</span>
                    </div>
                    </div>
                </div>
             </div>

        `;
        $container.append(card);
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

let incomeNames = [];
let expenseNames = [];

const topCurrencies = ["USD", "EUR", "AZN", "GBP", "TRY"];
const allCurrencies = [
  "USD",
  "EUR",
  "AZN",
  "GBP",
  "TRY",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "INR",
  "RUB",
  "BRL",
  "ZAR",
  "SEK",
  "CHF",
  "PLN",
  "NOK",
  "DKK",
  "NZD",
  "MXN",
];

function handleAjaxError(err) {
  const message = err.responseJSON?.message || "Error occurred";

  let isAuthErr = err.responseJSON?.code === "UNAUTHORIZED";
  if (isAuthErr) {
    console.warn("Auth error!");
    localStorage.removeItem("bt_auth_token");
    window.location.href = "/login.html";
  }
}

function getIncomesCategoryNames() {
  $.ajax({
    url: INCOMES_GET_URL,
    type: "GET",
    success: function (data) {
      incomeNames = data.categories.map((cat) => cat.name);
      if ($('input[name="category_type"]:checked').val() === "+") {
        populateCategories("+");
      }
    },
    error: handleAjaxError,
  });
}

function getExpenseCategoryNames() {
  $.ajax({
    url: EXPENSES_GET_URL,
    type: "GET",
    success: function (data) {
      expenseNames = data.categories.map((cat) => cat.name);
      if ($('input[name="category_type"]:checked').val() === "-") {
        populateCategories("-");
      }
    },
    error: handleAjaxError,
  });
}

function populateCategories(type) {
  const list = type === "+" ? incomeNames : expenseNames;
  const $select = $("#categorySelect");
  $select.empty().append('<option value="">Select a category</option>');
  $.each(list, (_, value) => {
    $select.append(`<option value="${value}">${value}</option>`);
  });
}

function populateCurrencies() {
  const $currency = $("#currency");
  $currency.empty();
  const added = new Set();

  //top currencies
  $.each(topCurrencies, (_, currency) => {
    $currency.append(`<option value="${currency}">${currency}</option>`);
    added.add(currency);
  });

  $.each(allCurrencies, (_, currency) => {
    if (!added.has(currency)) {
      $currency.append(`<option value="${currency}">${currency}</option>`);
    }
  });
}

$("#filterBtn").on("click", function () {
  const $currency = $("#filterCurrency");
  $currency.empty();
  const added = new Set();

  //top currencies
  $.each(topCurrencies, (_, currency) => {
    $currency.append(`<option value="${currency}">${currency}</option>`);
    added.add(currency);
  });

  $.each(allCurrencies, (_, currency) => {
    if (!added.has(currency)) {
      $currency.append(`<option value="${currency}">${currency}</option>`);
    }
  });
});

$(document).ready(function () {
  getTransactions();
  getIncomesCategoryNames();
  getExpenseCategoryNames();
  populateCurrencies();

  $('input[name="category_type"]').change(function () {
    const selectedType = $('input[name="category_type"]:checked').val();
    populateCategories(selectedType);
  });

  $("#addTransactionForm").submit(function (e) {
    e.preventDefault();
    const newTxn = {
      category_name: $("#categorySelect").val(),
      category_type: $('input[name="category_type"]:checked').val(),
      amount: parseFloat($("#amount").val()),
      currency: $("#currency").val(),
      note: $("#note").val().trim(),
    };
    console.log("Form data:", newTxn);

    $.ajax({
      url: `${TXN_POST_GET_URL}`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(newTxn),
      success: function (response) {
        showNotification(response.message, "success");
        getTransactions();
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addTransactionModal")
        );
        modal.hide();
        $("#addTransactionForm")[0].reset();
      },
      error: function (err) {
        console.log(err);
        showNotification(err.responseJSON?.message || "Failed");
      },
    });
  });

  // Get filtered transactions
  $("#filterForm").on("submit", function (e) {
    e.preventDefault();

    const filterData = {
      category_names: $("#names").val(),
      amount: $("#filterAmount").val(),
      currency: $("#filterCurrency").val(),
      created_at: $("#created_at").val(),
      category_type: $("#category-type").val(),
    };

    const queryString = new URLSearchParams(filterData).toString();

    $.get(`${TXN_POST_GET_URL}?${queryString}`, function (data) {
      updateTransactions(data.transactions);
    }).fail(function (error) {
      console.log(error);
    });

    $("#filterModal").modal("hide");
  });

  $("#uploadBtn").on("click", function () {
    const fileInput = $("#txnImage")[0];
    const file = fileInput.files[0];

    if (!file) {
      showNotification("Please select an image to upload.");
      return;
    }

    if (file.size > 1024 * 1024) {
      showNotification("Image must be less than 1MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    $("#loadingSpinner").removeClass("d-none");

    $.ajax({
      url: `${IMG_TO_TXN_URL}`,
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log("Upload success:", response);

        $("#imageToTxnModal").modal("hide");
        $("#loadingSpinner").addClass("d-none");
      },
      error: function (xhr, status, error) {
        const errMsg = xhr.responseJSON?.message || "Something went wrong!";
        showNotification(errMsg);
        $("#loadingSpinner").addClass("d-none");
      },
    });
  });
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
