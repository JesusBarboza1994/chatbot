export function queryDataBase(response){
  const start = response.indexOf("SELECT");
  const end = response.indexOf(";", start);

  if (start !== -1 && end !== -1) {
    const substring = response.substring(start, end + 1);
    console.log(substring);
} else {
    console.log("No se encontró la consulta SQL en el texto.");
}
}