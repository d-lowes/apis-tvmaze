"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = "http://api.tvmaze.com";
const DOGE_IMG = "https://thedrum-media.imgix.net/thedrum-prod/s3/news/tmp/637022/shiba1.png?w=608&ar=default&fit=crop&crop=faces,edges&auto=format&dpr=1"

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm(searchTerm) {
  let tvShowsRequest = await axios.get(`${BASE_URL}/search/shows`, {
    params: {
      q: searchTerm
    }
  });

  return tvShowsRequest.data.map(showSearchResults => {
    const showImg = showSearchResults.show.image
                    ? showSearchResults.show.image.medium
                    : DOGE_IMG;

    return {
      id: showSearchResults.show.id,
      name: showSearchResults.show.name,
      summary: showSearchResults.show.summary,
      image: showImg
    }
  });

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
async function getEpisodesOfShow(id) {
  const episodeData = await axios.get(
    `${BASE_URL}/shows/${id}/episodes`
  );

  return episodeData.data.map(episode => {
    //TODO: destructure episode object (id, name, season, number)
    let {id, name, season, number} = episode;

    return {id, name, season, number};
  });

}

/** Accept an array of episodes; append the episode info and update
 *  the DOM display
 */
function displayEpisodes(episodes) {
  //TODO: '$' before name for jquery items, place all variables at the top
  const episodeList = $("#episodesList");

  episodeList.empty();
  $("#episodesArea").css("display", "block");
  //TODO: .show(), consider showing all AFTER appending all

  for (let ep of episodes) {
    let newEpisode = $("<li>");
    newEpisode.text(`${ep.name} (season ${ep.season}, number ${ep.number})`);
    episodeList.append(newEpisode);
  }

}

/** Takes in a show id and utilizes both getEpisodesofShow() and displayEpisodes(),
 *  acting as a conductor function. Activates when episode button is clicked
 *  under any show
 */
async function getEpisodesAndDisplay(id) {
  const episodesFromId = await getEpisodesOfShow(id);
  displayEpisodes(episodesFromId);
}

/** Handles the click event on an 'episodes' button under a tv show series */
function handleClickEpisodes(evt) {
  //extract evt ancestor data.id point
  let ancestorEpId = $(evt.target).closest(".Show").attr("data-show-id");
  //TODO: .attr("data-show-id") ~ .data("show-id")

  // console.log('ancestor id = ', ancestorEpId);
  //TODO: when you call async function you should await, fine rn because func not returning anything
  getEpisodesAndDisplay(ancestorEpId);

}

$("#showsList").on("click", ".Show-getEpisodes", handleClickEpisodes);
