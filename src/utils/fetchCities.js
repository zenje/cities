import CITY_DATA from "../data/cities15000.txt";
import COUNTRY_DATA from "../data/countryInfo.txt";
import ADMIN_DATA from "../data/admin1CodesASCII.txt";

class CityInfo {
  constructor(
    id,
    name, // ascii name
    displayName, // name with special chars included
    population,
    coordinates,
    country,
    adminRegion
  ) {
    this.id = id;
    this.name = name;
    this.displayName = displayName;
    this.population = population;
    this.coordinates = coordinates;
    this.country = country;
    this.adminRegion = adminRegion;
  }
}

const getFileLines = async (fileName) => {
  return await fetch(fileName)
    .then((r) => r.text())
    .then((text) => text.split(/\n/).filter((line) => /^[^#]/.test(line)));
};

class CityFetcher {
  static async get() {
    const countriesByCode = {};
    let countryLines = await getFileLines(COUNTRY_DATA);

    for (let line of countryLines) {
      let columns = line.split(/\t/);
      countriesByCode[columns[0]] = columns[4];
    }

    const adminRegionsByCode = {};
    let adminLines = await getFileLines(ADMIN_DATA);

    for (let line of adminLines) {
      let columns = line.split(/\t/);
      adminRegionsByCode[columns[0]] = columns[2];
    }

    let cityLines = await getFileLines(CITY_DATA);

    let cities = {};
    for (let line of cityLines) {
      let columns = line.split(/\t/);
      if (columns) {
        // asciiname, name of geographical point in plain ascii characters
        let city = columns[2];
        cities[city] = new CityInfo(
          columns[0],
          columns[2],
          columns[1],
          columns[14],
          [columns[5], columns[4]],
          countriesByCode[columns[8]],
          adminRegionsByCode[`${columns[8]}.${columns[10]}`]
        );
      }
    }
    return cities;
  }
}

export { CityInfo, CityFetcher };
