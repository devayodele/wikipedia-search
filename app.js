async function handleSubmit(event) {
  //Clear previous results
  searchResults.textContent = "";

  const searchTerm = document.getElementById("searchTerm");

  const inputValue = searchTerm.value;
  const searchQuery = inputValue.trim();

  const indicator = document.querySelector(".js-spinner");

  indicator.classList.remove("hidden");

  try {
    const results = await searchWikipedia(searchQuery);
    console.log(results.query.search);
    searchResults.innerHTML = dispayResults(results, searchQuery);
  } catch (error) {
    console.log(error);
    alert("Faied to search Wikipedia!");
  } finally {
    indicator.classList.add("hidden");
  }
}

async function searchWikipedia(query) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const jsonResponse = await response.json();

  console.log(jsonResponse.query.search);

  return jsonResponse;
}
// strip html tags off the title and snippets
function stripHtml(html) {
  const div = document.createElement("div");

  div.innerHTML = html;

  return div.textContent;
}

//Highlight all the occurences of search query from the string
function highlight(str, query, className = "highlight") {
  const hl = `<span class=${className}>${query}<span>`;

  return str.replace(new RegExp(query, "gi"), hl);
}

function dispayResults(results, query) {
  return results.query.search
    .map((result) => {
      const title = highlight(stripHtml(result.title), query);

      const snippet = highlight(stripHtml(result.snippet), query);

      const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

      return `<article>
      <div class='resultDiv'>
       <a href=${url} class='result-link' target='_blank'>${url}</a>
        
         <a href=${url} target='_blank'><h3 class='result-title'>${result.title}</h3></a>
      
       <span class='result-snippet'>${result.snippet}</span>
       </div>
      </article>`;
    })
    .join("");
}

const btn = document.getElementById("btn");

btn.addEventListener("click", handleSubmit);
