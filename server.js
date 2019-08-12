const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require("cors");// nije bitan

const app = express();
app.use(cors());
app.options('*', cors());//isto

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.set('views','./Project');
app.use('/Project', express.static(path.join(__dirname, 'Project')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.Name}</li>
      <li>Email: ${req.body.Email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.Message}</p>
  `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: false, 
    auth: {
        user: 'mikingBusinessMail@gmail.com',
        pass: 'nodlocnost'  
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
      from: '"Nodemailer Contact" <mikingBusinessMail@gmail.com>', 
      to: 'sajonacc@gmail.com',
      subject: 'Node Contact Request',
      text: 'Hello world?',
      html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server started...'));