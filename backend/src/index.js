const express = require('express')
const { v4: uuid } = require('uuid')
const { Ingest, Search } = require('sonic-channel')

const app = express();

app.use(express.json())

const SonicChannelIngest =  new Ingest({
    host: 'localhost',
    port: 1491,
    auth: 'SecretPassword',
})

const SonicChannelSearch = new Search({
    host: 'localhost',
    port: 1491,
    auth: 'SecretPassword',
})

SonicChannelIngest.connect({
    connected : () => {
        // Connected handler
        console.log("conectou");
      },
})
 
SonicChannelSearch.connect({
    connected : () => {
        // Connected handler
        console.log("conectou");
      },
})

app.get('/', async(req,res)=>{
    res.json({message: true})
})

app.post('/pages', async(req,res)=>{
    const { title, content } = req.body;
    const id = uuid();

                                //  tabela , categorização, o que eu quero salvar , o que quero buscar 
    await SonicChannelIngest.push( 'pages' ,   'default'  , ` page:${id}   `  , `${title} ${content}` , {
        lang: 'por',
    })

    res.status(201).send()
})

app.get('/search', async(req,res)=>{
    const { q } = req.query;

    const results = await SonicChannelSearch.query(
        'pages', //tabela
        'default', //categorização
        q, //parametro
        { lang: 'por' } //lang
    )    

    res.json(results)
})

app.get('/sugest', async(req,res)=>{

    const { q } = req.query;

    const results = await SonicChannelSearch.suggest(
        'pages', //tabela
        'default', //categorização
        q, //parametro
        { limit: 5 } // limite de dados buscados
    )    

    res.json(results)
})

app.listen(3333, () => {
    console.log('server listing in http://localhost:3333')
})