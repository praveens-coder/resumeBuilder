const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve frontend files

app.post('/generate', (req, res) => {
    const {
        name, email, phone, linkedin, github,
        university, location, degree, major, grad_year,
        job_title, company, company_location, job_dates, responsibility_1, responsibility_2, responsibility_3,
        project_name, project_dates, project_description, technologies,
        languages, frameworks, dev_tools
    } = req.body;

    // Load LaTeX template and replace placeholders with user data
    const templatePath = 'template.tex';
    let templateContent = fs.readFileSync(templatePath, 'utf8');

    templateContent = templateContent
        .replace('{{NAME}}', name)
        .replace('{{EMAIL}}', email)
        .replace('{{PHONE}}', phone)
        .replace('{{LINKEDIN}}', linkedin)
        .replace('{{GITHUB}}', github)
        .replace('{{UNIVERSITY}}', university)
        .replace('{{LOCATION}}', location)
        .replace('{{DEGREE}}', degree)
        .replace('{{MAJOR}}', major)
        .replace('{{GRAD_YEAR}}', grad_year)
        .replace('{{JOB_TITLE}}', job_title)
        .replace('{{COMPANY}}', company)
        .replace('{{COMPANY_LOCATION}}', company_location)
        .replace('{{JOB_DATES}}', job_dates)
        .replace('{{RESPONSIBILITY_1}}', responsibility_1)
        .replace('{{RESPONSIBILITY_2}}', responsibility_2)
        .replace('{{RESPONSIBILITY_3}}', responsibility_3)
        .replace('{{PROJECT_NAME}}', project_name)
        .replace('{{PROJECT_DATES}}', project_dates)
        .replace('{{PROJECT_DESCRIPTION}}', project_description)
        .replace('{{TECHNOLOGIES}}', technologies)
        .replace('{{LANGUAGES}}', languages)
        .replace('{{FRAMEWORKS}}', frameworks)
        .replace('{{DEV_TOOLS}}', dev_tools);

    // Save the new LaTeX file
    fs.writeFileSync('resume.tex', templateContent);

    // Compile LaTeX to PDF
    exec('pdflatex resume.tex', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.download('./resume.pdf');

        // Delete temporary files after sending
        setTimeout(() => {
            fs.unlinkSync('resume.tex');
            fs.unlinkSync('resume.pdf');
        }, 5000);
    });
});

// Start server
app.listen(3000, () => console.log('🔥 Server running on http://localhost:3000 🚀'));
