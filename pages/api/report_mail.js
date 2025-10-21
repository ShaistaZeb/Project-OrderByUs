export default function (req, res) {


    let nodemailer = require('nodemailer')


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'orderbyus17@gmail.com',
            pass: "uajfvoanqycsyfkf",
        },
    });
    const mailData = {
        from: 'orderbyus17@gmail.com',
        to: 'orderbyus17@gmail.com',
        subject: `Report`,
        text: req.body.message + " | Sent from: " + "req.body.email",

        html: `<div>${req.body.message}</div><p>Sent from:
    "req.body.email"</p>`
    }

    transporter.sendMail(mailData, async function (err, info) {
        if (err)
        {
            console.log(err, "here");
            return await res.status(201).end();
        }
            
        else
        {
            console.log(info, "yes")
            return await res.status(202).end();
        }
            
    })
    // return res.status(200).end();
}