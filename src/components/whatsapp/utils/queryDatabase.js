export async function queryDataBase(input){
  const params =JSON.parse(input)
  console.log("params", params)

  const param = Object.entries(params).reduce((acc, curr, index) => {
    acc = acc + curr[0] + "=" + curr[1] + (index===Object.entries(params).length-1 ? "" : "&")
    return acc
  },"?") 

  const url = process.env.API_URL + "/search" + param
  console.log("CONSULTANDO...", input)

  const api_response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await api_response.json()
  console.log("RESPONSE DE QUERY", data)
  return JSON.stringify(data.codes)
}