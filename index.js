const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const perguntaModel = require("./models/pergunta");
const respostaModel = require("./models/resposta");
const connection = require("./models/conexao");

connection.authenticate().then(() => {
    console.log("Conexão feita com o banco de dados!");
}).catch((erro) => {
    console.log(erro);
});

//Instrução para o express entender qual o motor de template (tempolate engine), no caso o EJS
app.set("view engine", "ejs");
//Instrução para o express entender que tem que trabalhar com arquivos estáticos dessa pasta
app.use(express.static("public"));
//Instrução para o express utilizar o body-parser, o qual traduzdados do formulário em JS
app.use(bodyParser.urlencoded({extended: false}));
//instruções para ler dados de formulário via JSON, principalmente em API
app.use(bodyParser.json());

app.get("/", (req, res) => {
    perguntaModel.findAll({ raw: true, order: [ ["id", "DESC"] ]})
    .then((perguntas) => {
        res.render("index", {
            perguntas: perguntas
        }); 
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id;
    perguntaModel.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            respostaModel.findAll({
                where: {
                    perguntaId: pergunta.id
                },
                order: [ ["id", "DESC"] ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            })

            
        } else {
            res.redirect("/");
        }
    })
});

app.post("/salvarpergunta", (req, res) => {
    function Pergunta(titulo, descricao){
        this.titulo = titulo;
        this.descricao = descricao;
    }

    let p = new Pergunta(req.body.titulo, req.body.descricao);

    perguntaModel.create({
        title: p.titulo,
        description: p.descricao
    }).then(() => {
        res.redirect("/");
    })

});

app.post("/responder", (req, res) => {
    let corpo = req.body.corpo;
    let idPergunta = req.body.pergunta;

    respostaModel.create({
        corpo: corpo,
        perguntaId: idPergunta
    }).then(() => {
        res.redirect("/pergunta/"+idPergunta)
    })
})

app.listen(8181, () => {
    console.log("Servidor rodando!");
})