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
        to: req.body.email,
        subject: `Your Order ${req.body.name} has been takenUp`,
        text: req.body.message + " | Sent from: " + "orderbyus.herokuapp.com",

        html: `<div>${req.body.message}</div><p>Sent from:
    "orderbyus.herokuapp.com"</p>`
    }

    transporter.sendMail(mailData, function (err, info) {
        if (err)
            console.log(err, "here");
        else
            console.log(info, "yes")
    })
    res.status(200)
}