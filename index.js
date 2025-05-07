const express=require('express')
const port=8000;
const path=require('path')
const router=express.Router();
const app = express();
const db = require('./config/mongoose');
const tasks = require('./models/task')
console.log('router loaded');
app.set('case sensitive routing', false);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ 'extended': true }));
app.use(express.static('assets'));

app.get('/',function(req,res){
    tasks.find({}).then(function(task){
        return res.render('to_do_list',{
            title:"My TO-DO App",
            task_list:task
        });
    })
    .catch(function(err){
        console.log('error in fetching tasks from db');
        return;
    })
});
app.post('/create-task', function (req, res)
{
    tasks.create(req.body, (error, new_task) =>
    {
        if (error)
        {
            console.log('error in creating a task!');
            return;
        }
        return res.redirect('back');
    });
});
app.get('/delete-tasks/', function(req, res)
{
    let ids=new Array();
    for(let i in req.query){
        ids.push(req.query[i]);
    }
    tasks.deleteMany({_id:{$in:ids}}, function(error){
        if(error)
        {
            console.log('Unable to delete from the database.');
            return;
        }
        return res.redirect('back');
    })
});
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`)
    }
    console.log(`Server is running on port: ${port}`);
})