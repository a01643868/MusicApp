const getToken = async () => {
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
