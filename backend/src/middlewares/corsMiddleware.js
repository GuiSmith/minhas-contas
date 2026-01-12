const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1',
    'https://guismith.github.io/minhas-contas-frontend',
    'iyolvtsp5.localto.net',
];

const options = {
    origin: allowedOrigins,
    // origin: 'https://guismith.github.io/minhas-contas',  // Domínio permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeçalhos permitidos
    credentials: true
};

export default { options };