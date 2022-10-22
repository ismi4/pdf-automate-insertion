import express, { Application, Request, Response } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import _ from 'lodash';

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
            //Use the name of the input field (i.e. "pdf") to retrieve the uploaded file
            let pdf = req.files.pdf as UploadedFile;
            
            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            pdf.mv('./uploads/' + pdf.name);

            //send response
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


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})
