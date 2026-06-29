import { useState } from 'react'
import './App.css'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [banned, setBanned] = useState([]);
  const [attributes, setAttributes] = useState({
    id: "",
    breed: "",
    weight: "",
    life_span: "",
    origin: "",
    url: "",
  });
  const [prevCats, setPrevCats] = useState([]);

  const onDiscover = () => {
    // update banned list?
    makeQuery();
  }

  const makeQuery = () => {
    console.log("API KEY:", ACCESS_KEY);
    let query = `https://api.thecatapi.com/v1/images/search?has_breeds=true&order=RANDOM&limit=1&api_key=${ACCESS_KEY}`;
    callAPI(query).catch(console.error);
  };

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    const catData = json[0];
    const breedData = catData.breeds[0];

    const newCat = {
      id: catData.id,
      breed_id: breedData.id,
      breed: breedData.name,
      weight: breedData.weight.imperial + " lbs",
      life_span: breedData.life_span + " yrs",
      origin: breedData.origin,
      url: catData.url,
    };

    setAttributes(newCat);
    setPrevCats((previous) => [...previous, newCat]);
  };

  const ban = (type, value) => {
    setBanned((previous) => [...previous, { type, value }]);
  };

  const unban = (type, value) => {
    setBanned((previous) =>
      previous.filter((item) => !(item.type === type && item.value === value))
    );
  };


  return (
    <div className="container">
      <div className="side-container">
        <h3>Discovered</h3>
        {prevCats.map((prevCat) => (
          <div key={prevCat.id}>
            <img src={prevCat.url} alt="cat" className="cat-image" />
            <p>{prevCat.breed}</p>
          </div>
        ))}
      </div>


      <div className="center-container">
        <h1>1 Billion Cats.</h1>
        <h2>Discover them.</h2>
        <h2>Click an attribute to strike it with the ban hammer.</h2>
        <h2>😼</h2>
        <div>
          <div className="cat-info">
            {attributes.url == "" ? (
              <h2> Cat information will appear here.</h2>
            ) : (
              <div>
                {/* <h2>{attributes.id}</h2> */}
                <div>
                  <button className="smaller-text" onClick={() => ban("breed", attributes.breed)}>{attributes.breed}</button>
                  <button className="smaller-text" onClick={() => ban("weight", attributes.weight)}>{attributes.weight}</button>
                  <button className="smaller-text" onClick={() => ban("life_span", attributes.life_span)}>{attributes.life_span}</button>
                  <button className="smaller-text" onClick={() => ban("origin", attributes.origin)}>{attributes.origin}</button>
                </div>
                <img src={attributes.url} alt="cat" className="cat-image" />
              </div>
            )}

          </div>
          <br></br>

        </div>
        <button className="larger-text" onClick={onDiscover}>Discover!</button>
      </div>


      <div className="side-container">
        <h3>Banned</h3>
        {banned.length > 0 &&
          banned.map((item, index) => (
            <button
              key={index}
              className="smaller-text"
              onClick={() => unban(item.type, item.value)}
            >
              {item.value}
            </button>
          ))}
      </div>

    </div>
  );
};

export default App;