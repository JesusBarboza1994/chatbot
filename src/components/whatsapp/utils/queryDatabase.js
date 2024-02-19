export async function queryDataBase(response){
  const start = response.indexOf("{");
  const url = process.env.API_URL + "/codes"
  const end = response.indexOf("}", start);
  let content
  if (start !== -1 && end !== -1) {
    content = response.substring(start, end + 1);
    console.log(content);
  }else {
    throw new Error
  }
  console.log("CONSULTANDO...")
  const api_response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: content
  })
  const data = await api_response.json()
  console.log("RESPONSE", data)
  return data.codes
}