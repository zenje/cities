// To handle CORS: for anonymous requests, origin query string parameter can
// be set to * which will allow requests from anywhere.
const getPageIdsUrl = (name) =>
  `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${name}&format=json`;
const getExtractUrl = (pageId) =>
  `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&pageids=${pageId}&formatversion=2&exlimit=1&exintro=1&explaintext=1`;

const insertLineBreaks = (text) =>
  text.split("\n").map((str, index) => <p key={`info-${index}`}>{str}</p>);

// removes first parentheses phrase from first line
// Example:
// "Chicago ( (listen) shih-KAH-goh, locally also  shih-KAW-goh;),
// officially the City of Chicago..."
// -> "Chicago, officially the City of Chicago..."
const cleanText = (text) => {
  //console.log(text);
  const lines = text.split(". ");
  const firstLine = lines[0];
  let parens = firstLine.matchAll(/[()]/g);

  console.log(parens);
  let parenCount = 0;
  let startIndex = -1;
  let endIndex = -1;
  for (let item of parens) {
    if (item[0] === "(") {
      if (startIndex === -1) {
        startIndex = item.index;
      }
      parenCount++;
    } else {
      parenCount--;
    }
    if (parenCount === 0) {
      endIndex = item.index;
      break;
    }
  }

  if (endIndex !== -1) {
    console.log(firstLine);
    let newFirstLine =
      firstLine.slice(0, startIndex - 1).trim() + firstLine.slice(endIndex + 1);
    lines[0] = newFirstLine;
    console.log(newFirstLine);
    return lines.join(". ");
  }
  return text;
};

class CityExtractFetcher {
  static async get({ name, country, adminRegion }) {
    const pageId = await fetch(getPageIdsUrl(name))
      .then((response) => response.json())
      .then((data) => {
        if (data && data.query && data.query.search) {
          let maxScore = -1;
          let mostLikelyResult = undefined;
          console.log(data.query.search);
          for (let result of data.query.search) {
            let score = 0;
            let title = result.title.toLowerCase();
            let lowerCName = name.toLowerCase();
            if (title === lowerCName) {
              score++;
            }
            if (title.indexOf(lowerCName) !== 0) {
              score -= 2;
            }
            if (
              title.indexOf("school") > -1 ||
              title.indexOf("university") > -1
            ) {
              score--;
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
      let extract = await fetch(getExtractUrl(pageId))
        .then((response) => response.json())
        .then((data) =>
          data && data.query && data.query.pages
            ? data.query.pages[0].extract
            : null
        );
      extract = cleanText(extract);
      return insertLineBreaks(extract);
    }
  }
}

export { CityExtractFetcher };
