const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://dev:dev@localhost:27017/todos');
const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('Conexion a la BD exitosa...');
});

connection.on('error', (err)=>{
    console.log('Error en la conexion a la BD: ',err);
});

//Todo
const Todo = mongoose.model('Todo', {text: String, completed: Boolean});


//AGREGAR
app.post('/add',(req,res)=>{
    const todo = new Todo({text: req.body.text, completed: false});

    todo.save().then(doc =>{
        console.log('Dato insertado correctamente...', doc);
        //res.redirect('/');
        res.json({response: 'success'})
    })
    .catch(err =>{
        console.log('Error al insertar el todo:  ', err.message);
    })
});

//MOSTRAR
app.get('/getall',(req,res)=>{
    Todo.find()
    .then(doc=>{
        res.json({response:'success', data: doc});
    })
    .catch(err=>{
        console.log('Error al consultar elementos...',err.message)
    });
});

//UPDATE
app.get('/complete/:id/:status',(req,res)=>{
    
    const id = req.params.id;
    const status = req.params.status == 'true'; //convertir a booleano

    Todo.findByIdAndUpdate({_id: id}, {$set:{completed:status}})
    .then(doc=>{
        res.json({response: 'success'});
    })
    .catch(err=>{
        res.json({respone:'failes'});
    });
});

//DELETE
app.get('/delete/:id',(req,res)=>{
    
    const id = req.params.id;
    Todo.findByIdAndDelete({_id:id})
    .then(doc=>{
        //res.json({response:'success delete'})
        res.redirect('/');
    })
    .catch(err=>{
        console.log('Error al eliminar dato ', err.message);
        res.status(400).json({response:'failed delete'})
    });
});

app.listen(3000, ()=>{
    console.log('servidor listo...');
});