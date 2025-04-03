import express from 'express';
import dotenv from 'dotenv';
import { processMembers, filterMembersByRequirements } from './services/memberService.js';
import { generateHtmlContent } from './services/htmlService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint principal
app.get('/clash-api/clan/members', async (req, res) => {
    try {
        const membersWithHeroes = await processMembers();
        const { membersThatPass, membersThatFail } = filterMembersByRequirements(membersWithHeroes);
        const htmlContent = generateHtmlContent(membersThatPass, membersThatFail);
        res.send(htmlContent);
    } catch (error) {
        console.error(`⚠️ Error en la obtención de datos: ${error.message}`);
        res.status(500).json({ error: '🚨 Error al obtener los datos del clan o héroes.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
