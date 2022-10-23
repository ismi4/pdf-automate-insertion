import express, { Application, Request, Response } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import _ from 'lodash';
import fs from 'fs';

const app: Application = express()

app.use(fileUpload({
    createParentPath: true
}))

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))

const port: number | string = process.env.PORT || 3001

app.post('/upload-pdf', async (req, res) => {

    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            
            let pdf = req.files.pdf as UploadedFile;
            
            if (pdf.mimetype !== `application/pdf`)
                res.status(500).send(`File of inappropriate format was tried to be uploaded.`);

            pdf.mv('./uploads/' + pdf.name);

            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: pdf.name,
                    mimetype: pdf.mimetype,
                    size: pdf.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }

});

app.post('/delete-file',async (req, res) => {
    
    try {
        const filename : string = req.body.fileName;

        fs.stat(`./uploads/${filename}`, function (err, stats) {

            if(!stats){
                res.status(500).send(`File not found.`)
            } else {
                fs.unlink(`./uploads/${filename}`,function(err){
                    res.status(200).send(`File is deleted`);
               });     
            }
         

         });
    } catch (err) {
        res.status(500).send(err);
    }

})

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})
