const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const sequelize = require('./config/bd');

app.engine('handlebars', exphbs.engine({defaultLayout: false}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function conectarBD() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    app.listen(3000, () =>{
        console.log('Servidor rodando com sucesso')
    })
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}

conectarBD();
