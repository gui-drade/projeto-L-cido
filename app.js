const express = require('express');
const { engine } = require('express-handlebars');
const bcrypt = require('bcrypt');
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


app.get('/', async (req, res) => {
    try {
        const adms = await ADM.findAll();
        res.render('listar', { adms });
    } catch (error) {
        console.error('Erro ao buscar ADMs:', error.message);
        res.status(500).send("Erro interno ao carregar a listagem.");
    }
});

app.get('/cadastrar', (req, res) => {
    res.render('cadastro');
});

app.post('/cadastrar', async (req, res) => {
    try {
        const { nome, senha, email, cpf } = req.body;

        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const cpfLimpo = cpf.replace(/\D/g, '');

        await ADM.create({ 
            nome, 
            senha: senhaCriptografada, 
            email, 
            cpf: cpfLimpo 
        });

        res.redirect('/');
    } catch (error) {
        console.error('Erro ao cadastrar:', error.message);
        res.status(500).send("Erro ao processar o cadastro. Verifique os dados (e-mail ou CPF já podem existir).");
    }
});

app.get('/editar/:cpf', async (req, res) => {
    try {
        const adm = await ADM.findByPk(req.params.cpf);
        if (adm) {
            res.render('editar', { adm });
        } else {
            res.status(404).send('Administrador não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao carregar edição:', error.message);
        res.status(500).send("Erro interno no servidor.");
    }
});

// Rota: Processar Edição (POST)
app.post('/editar/:cpf', async (req, res) => {
    try {
        const { nome, senha, email } = req.body;
        const dadosAtualizados = { nome, email };

        if (senha && senha.trim() !== "") {
            const saltRounds = 10;
            dadosAtualizados.senha = await bcrypt.hash(senha, saltRounds);
        }

        await ADM.update(dadosAtualizados, {
            where: { cpf: req.params.cpf }
        });
        
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao atualizar:', error.message);
        res.status(500).send("Erro ao atualizar os dados.");
    }
});

app.get('/deletar/:cpf', async (req, res) => {
    try {
        await ADM.destroy({
            where: { cpf: req.params.cpf }
        });
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao deletar:', error.message);
        res.status(500).send("Erro ao tentar excluir o registro.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});