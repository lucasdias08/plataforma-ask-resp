const Sequelize = require("sequelize");
const connection = require("./conexao");

const Pergunta = connection.define("pergunta", {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Pergunta.sync({force:false}).then(() => {}); //Se não existir a tabela "pergunta" ele cria!

module.exports = Pergunta;