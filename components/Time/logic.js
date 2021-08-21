function zfill(number, width) {
  var numberOutput = Math.abs(number);
  var length = number.toString().length;
  var zero = "0";
  if (width <= length) {
    if (number < 0) {
      return ("-" + numberOutput.toString());
    } else {
      return numberOutput.toString();
    }
  } else {
    if (number < 0) {
      return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
    } else {
      return ((zero.repeat(width - length)) + numberOutput.toString());
    }
  }
}

function GetDiference(dias, horas) {
  const time = new Date();
  let response, year, month, day, hour, minute, second, Anio, mes, dia, hora, minu, segun, futureD, futureH, dif, tree1, tree2
  year = time.getFullYear()
  month = time.getMonth() + 1;
  day = time.getDate();
  hour = time.getHours()
  minute = time.getMinutes()
  second = time.getSeconds()
  futureD = dias.split("-")
  futureH = horas.split(":")
  Anio = futureD[2]
  mes = futureD[1]
  dia = futureD[0]
  hora = futureH[0]
  minu = futureH[1]
  segun = futureH[2]
  tree1 = new Date(Anio, mes, dia, hora, minu, segun);
  tree2 = new Date(year, month, day, hour, minute, second);
  dif = tree1 - tree2
  response = dif / 1000
  return response
}
function currencyFormat(num) { return 'COP. ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') }
export { GetDiference, zfill, currencyFormat };