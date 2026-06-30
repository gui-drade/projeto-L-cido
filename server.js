const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const sequelize = require('./config/bd');
const Estudante = require('./models/estudante');

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.sync();

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
    const { Op } = require('sequelize');
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

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});