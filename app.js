var baseUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var key = "paste-your-api-key-here";

// Grab all references

var searchTerm = document.querySelector(".search");
var startDate = document.querySelector(".start-date");
var endDate = document.querySelector(".end-date");
var searchFrom = document.querySelector("form");
var submitBtn = document.querySelector(".submit");

var nextBtn = document.querySelector(".next");
var previousBtn = document.querySelector(".prev");

var section = document.querySelector("section");
var nav = document.querySelector("nav");

nav.style.display = "none";

var pageNumber = 0;
var displayNav = false;

// Event listeners

searchFrom.addEventListener("submit", submitSearch);
// nextBtn.addEventListener("click", nextPage);
// previousBtn.addEventListener("click", previousPage);

function submitSearch(e) {
  pageNumber = 0;
  fetchResults(e);
}

function fetchResults(e) {
  e.preventDefault();
  url =
    baseUrl +
    "?api-key=" +
    key +
    "&page=" +
    pageNumber +
    "&q=" +
    searchTerm.value +
    '&fq=document_type:("article")';

  // validation
  if (startDate.value !== "") {
    url += "&begin_date=" + startDate.value;
  }
  if (endDate.value !== "") {
    url += "&end_date=" + endDate.value;
  }

  fetch(url)
    .then(async response => {
      return response.json();
    })
    .then(json => {
      displayResults(json);
    });
}

function displayResults(json) {
  var articles = json.response.docs;
  if (articles.length === 10) {
    nav.style.display = "block";
  } else {
    nav.style.display = "none";
  }

  // handling for no results
  if (articles.length === 0) {
    var para = document.createElement("p");
    para.textContent = "No results returned";
    section.appendChild(para);
  }
  // handling for results
  else {
    for (var i = 0; i < articles.length; i++) {
      var article = document.createElement("article");
      var heading = document.createElement("h2");
      var link = document.createElement("a");
      var img = document.createElement("img");
      var para1 = document.createElement("p");
      var para2 = document.createElement("p");

      var current = articles[i];
      link.href = current.web_url;
      link.textContent = current.headline.main;
      para1.textContent = current.snippet;
      para2.textContent = "Keywords :";

      for (var j = 0; j < current.keywords.length; j++) {
        var span = document.createElement("span");
        span.textContent = current.keywords[j].value + " ";
        para2.appendChild(span);
      }

      article.appendChild(heading);
      heading.appendChild(link);
      article.appendChild(para1);
      article.appendChild(para2);
      section.appendChild(article);
    }
  }
}
