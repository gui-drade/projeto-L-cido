const express = require('express');
const { engine } = require('express-handlebars');
const sequelize = require('./config/bd');
const ADM = require('./models/ADM');

const app = express();
const PORT = 3000;

app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.sync({ force: false }).then(() => {
    console.log('Banco de dados sincronizado!');
}).catch(err => console.error('Erro ao sincronizar banco:', err));

app.get('/', async (req, res) => {
    try {
        const adms = await ADM.findAll();
        res.render('listar', { adms });
    } catch (error) {
        res.status(500).send("Erro ao buscar ADMs: " + error.message);
    }
});

app.get('/cadastrar', (req, res) => {
    res.render('cadastro');
});

app.post('/cadastrar', async (req, res) => {
    try {
        const { nome, senha, email, cpf } = req.body;
        await ADM.create({ nome, senha, email, cpf });
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Erro ao cadastrar: " + error.message);
    }
});

app.get('/editar/:cpf', async (req, res) => {
    try {
        const adm = await ADM.findByPk(req.params.cpf);
        if (adm) {
            res.render('editar', { adm });
        } else {
            res.status(404).send('Administrador não encontrado');
        }
    } catch (error) {
        res.status(500).send("Erro: " + error.message);
    }
});

app.post('/editar/:cpf', async (req, res) => {
    try {
        const { nome, senha, email } = req.body;
        await ADM.update({ nome, senha, email }, {
            where: { cpf: req.params.cpf }
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Erro ao atualizar: " + error.message);
    }
});

app.get('/deletar/:cpf', async (req, res) => {
    try {
        await ADM.destroy({
            where: { cpf: req.params.cpf }
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Erro ao deletar: " + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});