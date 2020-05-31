export const empty = val => {
  return (
    val == "" || val == undefined || val == null || val == false || val == 0
  );
};

export const formatMoney = (number, places, symbol, thousand, decimal) => {
  number = number || 0;
  places = !isNaN((places = Math.abs(places))) ? places : 0;
  symbol = symbol !== undefined ? symbol : "";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "",
    i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : "")
  );
};

export const toCurrency = (number, decimal) => {
  //untuk menambahkan ppn settingan di view Grandtotal
  var number = parseFloat(number);

  money = formatMoney(number, decimal);
  return money;
};
