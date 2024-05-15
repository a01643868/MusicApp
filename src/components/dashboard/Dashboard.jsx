import React, { useState } from "react";
import { fetchSpotifyApi } from "../../api/spotifyAPI";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [results, setResults] = useState([]);

  const [responseSongs, setSongs] = useState([]);

  const [form, setForm] = useState({
    search: "",
    artist: "",
  });

  const [option, setOption] = useState("");

  const handleSearch = async () => {
    const params = new URLSearchParams();

    params.append(
      "q",
      encodeURIComponent(`remaster track:${form.search} artist:${form.artist}`)
    );
    params.append("type", option);

    const queryString = params.toString();

    const url = "https://api.spotify.com/v1/search";

    const updateUrl = `${url}?${queryString}`;
    const token = `Bearer ${localStorage.getItem("token")}`;

    const response = await fetchSpotifyApi(
      updateUrl,
      "GET",
      null,
      "application/json",
      token
    );

    console.log(response);
    setResults(response.tracks.items);

    setSongs(
      response.tracks.items.map((song) => ({
        name: song.name,
        artist: song.artists[0].name,
        album: song.album.name,
        image: song.album.images[0].url,
      }))
    );
  };

  const getDeviceId = async () => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const response = await fetchSpotifyApi(
      "https://api.spotify.com/v1/me/player/devices",
      "GET",
      null,
      "application/json",
      token
    );
    console.log(response);
    return response.device.id;
  };

  const handleGetToken = async () => {
    // stored in the previous step
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    let codeVerifier = localStorage.getItem("code_verifier");
    console.log({ codeVerifier });
    const url = "https://accounts.spotify.com/api/token";
    const clientId = "40fa65a93f1b41efb0448790cd48bed2";
    const redirectUri = "http://localhost:5173/";
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem("token", response.access_token);
  };

  const handlePlayMusic = async (song) => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const data = {
      uris: [song],
    };

    const id_device = "9a758cb7e768dd1d07447ab27926e3061609205f";

    const playSong = await fetchSpotifyApi(
      `https://api.spotify.com/v1/me/player/play?device_id=${id_device}`,
      "PUT",
      JSON.stringify(data),
      "application/json",
      token
    );
    console.log(playSong);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChange = (event) => {
    const newValues = {
      ...form,
      [event.target.name]: event.target.value,
    };
    console.log(newValues);
    setForm(newValues);
  };

  const handleSelectChange = (event) => {
    console.log(event.target.value);
    setOption(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("Search term:", searchTerm);
    }
  };

  const types = [
    "album",
    "artist",
    "playlist",
    "track",
    "show",
    "episode",
    "audiobook",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="flex flex-row items-center my-10">
        <button
          onClick={handleGetToken}
          className="bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-white font-bold py-2 px-4 mx-1 rounded shadow-md"
        >
          TOKEN
        </button>
        <button
          onClick={getDeviceId}
          className="bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-white font-bold py-2 px-4 rounded shadow-md"
        >
          DEVICE ID
        </button>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="flex items-center">
          <input
            name="search"
            type="text"
            placeholder="Search..."
            value={form.search}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-white bg-black"
          />
          <select
            name="types"
            onChange={handleSelectChange}
            className="ml-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-white bg-black"
          >
            <option value="Select">Select type...</option>
            {types.map((item) => (
              <option key={item} value={item} className="text-white bg-black">
                {item}
              </option>
            ))}
          </select>
          <input
            placeholder="artist"
            type="text"
            name="artist"
            value={form.artist}
            onChange={handleChange}
            className="ml-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-white bg-black"
          />
          <button
            className="ml-4 bg-[#18D760] rounded-lg px-4 py-2 text-white font-bold"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex justify-center my-5">
        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 bg-opacity-50 rounded-lg p-4 flex items-center space-x-4"
              >
                <img
                  className="w-16 h-16 rounded-md"
                  src={item.album.images[0].url}
                  alt="Album Cover"
                />
                <div className="flex flex-col">
                  <span className="text-white font-semibold">{item.name}</span>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm mt-2"
                    onClick={() => handlePlayMusic(item.uri)}
                  >
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
