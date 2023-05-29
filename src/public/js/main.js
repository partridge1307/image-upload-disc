$("#uploadBtn").on("click", () => {
  $("#upload").click();
});

$("#upload").on("input", () => {
  const files = $("#upload")[0].files;
  if (files.length) {
    $("#submit").click();
    $("#uploadBtn").find("path").attr("display", "none");
    $("#uploadBtn")
      .find("span")
      .html("Processing...")
      .attr("disabled", "disabled");
  }
});

let res;

$("#uploadForm").submit(function (e) {
  e.preventDefault();

  $.ajax({
    url: $(this).attr("action"),
    type: $(this).attr("method"),
    dataType: "JSON",
    data: new FormData(this),
    processData: false,
    contentType: false,
    success: function (data) {
      res = data;
      $("#htmlUrls").val(
        `${data
          .map((value, i) => `<img src="${value}" alt="page-${i}">`)
          .join("\n")}`
      );
      $("#urls").val(`${data.join("\n")}`);
      $("#uploadBtn").find("path").removeAttr("display");
      $("#uploadBtn").removeAttr("disabled").find("span").html(`Add`);
    },
    error: function (err) {
      alert(err.message);
      $("#uploadBtn").find("path").removeAttr("display");
      $("#uploadBtn").removeAttr("disabled").find("span").html(`Add`);
    },
  });
});

$("#urls").on("click", function () {
  this.setSelectionRange(0, this.value.length);
});

$("#htmlFormat").on("click", () => {
  if (!res) return alert("Please upload image first");
  $("#urls").toggle("display-none");
  $("#htmlUrls").toggle("display-none");
});

const sunIcon = document.querySelector(".sun");
const moonIcon = document.querySelector(".moon");
const htmlUrls = document.querySelector("#htmlUrls");

htmlUrls.classList.add("display-none");

const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

const toggle = () => {
  moonIcon.classList.toggle("display-none");
  sunIcon.classList.toggle("display-none");
};

const check = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    moonIcon.classList.add("display-none");
    return;
  }
  sunIcon.classList.add("display-none");
};

const themeSwitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    toggle();
    return;
  }
  document.documentElement.classList.add("dark");
  toggle();
};

sunIcon.addEventListener("click", () => {
  themeSwitch();
});

moonIcon.addEventListener("click", () => {
  themeSwitch();
});

check();
