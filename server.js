const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const sequelize = require('./config/bd');
const { Op } = require('sequelize');
// Importando o modelo Item.
const Item = require('./models/item');
//Importando o modelo de estudante
const Estudante = require('.models/estudante')

app.engine('handlebars', exphbs.engine({defaultLayout: false}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function conectarBD() {
  try {
    await sequelize.sync();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    app.listen(3000, () =>{
        console.log('Servidor rodando com sucesso')
    })
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}

conectarBD();



app.get('/cadastro', async(req,res) =>{
  res.render("cadastro")
})

app.post('/cadastro',async(req, res) =>{
  const nomeRecebido = req.body.nome
  const quantidadeRecebida = req.body.quantidade
  const imagemRecebida = req.body.imagem
  const categoriaRecebida = req.body.categoria
  const precoRecebido = req.body.preco
  const descricaoRecebida = req.body.descricao

  await Item.create ({
    nome: nomeRecebido,
    imagem: imagemRecebida,
    preco: precoRecebido,
    quantidade: quantidadeRecebida,
    categoria: categoriaRecebida,
    descricao: descricaoRecebida

 })
 res.redirect('/vitrine')

})

app.get('/vitrine', async(req,res) =>{
// rota com loja e busca
  const itemBuscado = req.query.busca

  let condicao = {}

  if(itemBuscado){
    condicao = {
      where: {
        nome: {
          [Op.like]: `%${itemBuscado}%`
        }
      }
    }
  }
  const itensCadastrados = await Item.findAll({... condicao,raw:true})
  res.render('vitrine', { itens: itensCadastrados, busca: itemBuscado });
})
// rota para deletar Item da loja
app.post('/deletar/:id', async(req,res) => {
  const idItem = req.params.id;
  await Item.destroy({
    where: {id:idItem}
  })

  res.redirect('/vitrine');
})

// rota para ir a pagina de alteração
app.get('/editar/:id', async(req,res) => {
  const idItem = req.params.id

  const itemEncontrado = await Item.findByPk(idItem,{raw: true});

  res.render('editar',{item: itemEncontrado})
})
// Rota para Editar item
app.post('/editar/:id', async(req,res) =>{
  const idItem = req.params.id;

  await Item.update ({
    nome: req.body.nome,
    imagem: req.body.imagem,
    preco: req.body.preco,
    quantidade: req.body.quantidade,
    categoria: req.body.categoria,
    descricao: req.body.descricao
  },{
     where: {id:idItem}
    })
  res.redirect('/vitrine')
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cadastro-aluno', (req, res) => {
    res.render('cadastro-aluno');
});

app.get('/acoes-rapidas', (req, res) => {
    res.render('acoes-rapidas');
});

app.post('/aluno/cadastrar', async (req, res) => {
    await Estudante.create({ 
        nome: req.body.nome, 
        idade: req.body.idade || 20 
    });
    res.redirect('/gerenciar-alunos');
});

app.get('/gerenciar-alunos', async (req, res) => {
    const termo = req.query.pesquisa || '';
    
    const estudantesDoBanco = await Estudante.findAll({
        where: {
            nome: { [Op.like]: `%${termo}%` }
        }
    });

    const alunos = estudantesDoBanco.map(e => e.toJSON());
    res.render('gerenciar-alunos', { alunos, pesquisa: termo });
});

app.post('/aluno/editar/:id', async (req, res) => {
    await Estudante.update(
        { nome: req.body.nome },
        { where: { id: req.params.id } }
    );
    res.redirect('/gerenciar-alunos');
});

app.get('/aluno/deletar/:id', async (req, res) => {
    await Estudante.destroy({ 
        where: { id: req.params.id } 
    });
    res.redirect('/gerenciar-alunos');
});

