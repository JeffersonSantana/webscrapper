var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express();

// Passo 1
app.get('/', function(req, res) {

  // Passo 2
   url = 'https://www.fanatec.com/us-en/product/pc';
   request(url, function(error, response, html) {

     // Assegurar que não tenha erros para fazer a raspagem de dados com sucesso
     if (!error) {
       var $ = cheerio.load(html);

       //Varrer links na página, acessar cada link que seja de produtos e pegar dados
       $('a').each(function(index, el){
         var url = (el.attribs.href) ? el.attribs.href.toString() : '';
         if(url.indexOf('https://www.fanatec.com/us-en/') >= 0) {
           if(url.indexOf('#') === -1) {
             const regex = /\/us-en\/([a-z-/.0-9]+.html)/g;
             if(regex.exec(url) !== null) {
               console.log(url);
             }
           }
         }
       });

       // Objeto que irá armazenar a tabela
       var resultado = [];

       // Passo 3
       // Manipulando o seletor específico para montar nossa estrutura
      var valor = $('#product_header > .right > .pro-info-box > .price > span.general').text().trim();
      var nome = $('#product_header > .right > .pro-info-box > .details h1').text().trim();
      var disponivel = $('#product_header > .right > .pro-info-box > .details > .availibity').text().trim();

      // Inserindo os dados obtidos no nosso objeto
      resultado.push({
        nome: nome,
        valor: valor,
        disponivel: disponivel
      });


       // Passo 4
      fs.writeFile('resultado.json', JSON.stringify(resultado, null, 4), function(err) {
          console.log('JSON escrito com sucesso! O arquivo está na raiz do projeto.')
      })

      res.end(JSON.stringify(resultado));
     }
   })
})

app.listen('8081')
console.log('Executando raspagem de dados na porta 8081...');
exports = module.exports = app;
