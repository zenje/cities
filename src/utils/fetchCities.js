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
    countryCode,
    country,
    adminRegion,
    isCapital
  ) {
    this.id = id;
    this.name = name;
    this.displayName = displayName;
    this.population = population;
    this.coordinates = coordinates;
    this.countryCode = countryCode;
    this.country = country;
    this.adminRegion = adminRegion;
    this.isCapital = isCapital;
  }
}

const getFileLines = async (fileName) => {
  return await fetch(fileName)
    .then((r) => r.text())
    .then((text) => text.split(/\n/).filter((line) => /^[^#]/.test(line)));
};

const checkCapitalExceptions = (countryCode, adminCode) => {
  return countryCode === "US" ? adminCode === "DC" : true;
};

class CityFetcher {
  static async get() {
    const countriesByCode = {};
    const capitalsByCountryCode = {};
    const countryLines = await getFileLines(COUNTRY_DATA);

    for (let line of countryLines) {
      let columns = line.split(/\t/);
      let countryCode = columns[0].trim();
      let countryName = columns[4].trim();
      let capital = columns[5].trim();
      countriesByCode[countryCode] = countryName;
      if (capital) {
        let c = `${capital}-${countryCode}`.toLowerCase();
        capitalsByCountryCode[c] = countryCode;
      }
    }

    const adminRegionsByCode = {};
    const adminLines = await getFileLines(ADMIN_DATA);

    for (let line of adminLines) {
      let columns = line.split(/\t/);
      adminRegionsByCode[columns[0]] = columns[2];
    }

    const cityLines = await getFileLines(CITY_DATA);

    let cities = {};
    for (let line of cityLines) {
      const columns = line.split(/\t/);
      if (columns) {
        // asciiname, name of geographical point in plain ascii characters
        const cityName = columns[2];
        const countryCode = columns[8];
        const adminCode = columns[10];
        const adminRegion = adminRegionsByCode[`${countryCode}.${adminCode}`];
        const isCapital =
          capitalsByCountryCode.hasOwnProperty(
            `${cityName}-${countryCode}`.toLowerCase()
          ) && checkCapitalExceptions(countryCode, adminCode);
        const key = `${cityName}-${adminRegion}`;
        cities[key] = new CityInfo(
          columns[0],
          cityName,
          columns[1],
          columns[14],
          [columns[5], columns[4]],
          countryCode,
          countriesByCode[countryCode],
          adminRegion,
          isCapital
        );
      }
    }
    return cities;
  }
}

export { CityInfo, CityFetcher };
