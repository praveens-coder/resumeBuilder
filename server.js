const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve frontend files

app.post('/generate', (req, res) => {
    const { name, email, phone } = req.body;

    // Define LaTeX resume template with user input
    const latexTemplate = `
\\documentclass{article}
\\begin{document}
\\section*{${name}}
Email: ${email} \\\\
Phone: ${phone}
\\end{document}
    `;

    // Save template as .tex file
    fs.writeFileSync('resume.tex', latexTemplate);
    
    // Compile LaTeX to PDF
    exec('pdflatex resume.tex', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.download('./resume.pdf');

        // Delete the files after sending
        setTimeout(() => {
            fs.unlinkSync('resume.tex');
            fs.unlinkSync('resume.pdf');
        }, 5000);
    });
});

// Start server
app.listen(3000, () => console.log('🔥 Server running on http://localhost:3000 🚀'));
