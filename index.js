const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const secretKey = 'Peru2024';
app.use(cors()); 
app.use(express.json());

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403); 
    }
}

app.post('/api/token', (req, res) => {
    const { id, username, merchant, sku } = req.body;
    
    const user = {
        id,
        username,
        merchant,
        sku
    };

    console.log(user)
    
    jwt.sign({ user }, secretKey, { expiresIn: '720h' }, (err, token) => {
        if (err) {
            res.sendStatus(500); 
        } else {
            res.json({ token });
        }
    });
});

app.get('/api/secure', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.json({
                message: 'token invalido',
                status: false
            });
            console.log(err)
        } else {
            res.json({
                message: 'Acceso permitido',
                status: true,
                authData
            });

            
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));
