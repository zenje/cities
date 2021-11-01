// To handle CORS: for anonymous requests, origin query string parameter can
// be set to * which will allow requests from anywhere.
const getPageIdsUrl = (name) =>
  `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${name}&format=json`;
const getExtractUrl = (pageId) =>
  `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&pageids=${pageId}&formatversion=2&exlimit=1&exintro=1&explaintext=1`;

class CityExtractFetcher {
  static async get({ name, country, adminRegion }) {
    const pageId = await fetch(getPageIdsUrl(name))
      .then((response) => response.json())
      .then((data) => {
        if (data && data.query && data.query.search) {
          let maxScore = -1;
          let mostLikelyResult = undefined;
          for (let result of data.query.search) {
            let score = 0;
            if (result.title === name) {
              score++;
            }
            if (
              new RegExp(`${adminRegion}|${country}|(city)`, "i").test(
                result.title
              )
            ) {
              score += 2;
            }
            if (new RegExp("city", "i").test(result.snippet)) {
              score++;
            }
            if (result.snippet.includes("refer")) {
              score--;
            }
            if (score > maxScore) {
              maxScore = score;
              mostLikelyResult = result;
            }
          }
          if (mostLikelyResult) {
            return mostLikelyResult.pageid;
          }
        }
      });

    if (pageId) {
      console.log(pageId);
      const extract = await fetch(getExtractUrl(pageId))
        .then((response) => response.json())
        .then((data) =>
          data && data.query && data.query.pages
            ? data.query.pages[0].extract
            : null
        );
      return extract;
    }
  }
}

export { CityExtractFetcher };
