const express = require('express')
const request = require('request')
const app = express()
const bodyParser = require('body-parser')
const valorPorPeso = 23
const porcentagemOtavio = 20

let dolarHoje = {}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/calcular', (req, res) => {


})

function getDateTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return year + "-" + month + "-" + day;
}

//.rates.BRL //{"base":"USD","date":"2018-03-13","rates":{"BRL":3.243}}
function pegarDolarHoje() {
  var url = 'http://api.fixer.io/latest?base=USD&symbols=BRL';
  request(url, function(error, response, html) {
    if (!error) {
      var ret = JSON.parse(response.body);
      console.log('dolarHoje.date:', dolarHoje.date);
      console.log('getDateTime:', getDateTime());
      if(dolarHoje.date !== getDateTime()) {
        dolarHoje = ret
        console.log(dolarHoje);
      }
    }
  });
}
pegarDolarHoje();

function converterReal(valor) { //10 * 3,242
  return parseFloat(valor * dolarHoje.rates.BRL).toFixed(2)
}

function frete(peso) {
  return {
    "real": converterReal(parseFloat(parseFloat(peso) * valorPorPeso).toFixed(2)),
    "dolar": parseFloat(parseFloat(peso) * valorPorPeso).toFixed(2)
  }
}

function comissao(peso, vInvoice) {
  var vFrete = frete(peso).real
  return converterReal(parseFloat(((parseFloat(vFrete) + parseFloat(vInvoice)) * parseFloat(porcentagemOtavio)) / 100).toFixed(2))
}

function total(peso, vInvoice) {
  var vFrete = frete(peso).real
  var vComissao = comissao(peso, vInvoice)
  console.log(converterReal(vInvoice));
  return parseFloat(vFrete) + parseFloat(vComissao) + parseFloat(converterReal(vInvoice))
}

module.exports = 'Hello world';
