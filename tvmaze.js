"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = "http://api.tvmaze.com/search/shows";
const DOGE = "https://www.cnet.com/a/img/resize/61c44c6765cb6b8529df884935ad7aefc622aeec/hub/2021/11/03/3c2a7d79-770e-4cfa-9847-66b3901fb5d7/c09.jpg"

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let showAdded = [];
  console.log(searchTerm);
  let gotShow = await axios.get(BASE_URL, {
                                      params: {
                                                q: searchTerm
                                              }
  })

  // console.log(gotShow.data);
  for (let i = 0; i < gotShow.data.length; i++) {
    let showResult ={};
    let showData = gotshow.data[i].show;
    if (showData)
    showResult.id = showData.id;
    showResult.name = showData.name;
    showResult.summary = showData.summary;
    showResult.image = showData.image.medium || DOGE;


    // console.log(gotShow.data[i]);
    showAdded.push(showResult);
  }

  // return gotShow.data.map(showSearchResults => {
  //               id:showSearchResults.show.id,
  //               name:showSearchResults.show.name,
  //               summary:showSearchResults.show.summary,
  //               image:showSearchResults.show.image.original || DOGE
  //         });


  return showAdded

}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="DOGE"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
