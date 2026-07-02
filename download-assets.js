import fs from 'fs';
import path from 'path';

const buildDir = path.join(process.cwd(), 'www_static', 'clients', 'october_5_2017');

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

const filesToDownload = ['app.html', 'index.html']; 
// Direct high-availability mirror for old discord client static assets
const sourceBaseUrl = 'https://raw.githubusercontent.com/lightcord/gandalf-archive/main/october_5_2017';

async function downloadFiles() {
    console.log("🛠️ Checking client assets for Render deployment...");
    for (const file of filesToDownload) {
        const filePath = path.join(buildDir, file);
        
        // If files already exist from the build step, skip downloading entirely
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
            console.log(`🔹 ${file} already exists. Skipping.`);
            continue;
        }

        try {
            const response = await fetch(`${sourceBaseUrl}/${file}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const fileStream = fs.createWriteStream(filePath);
            for await (const chunk of response.body) {
                fileStream.write(chunk);
            }
            fileStream.end();
            console.log(`✅ Successfully archived: ${file}`);
        } catch (err) {
            console.warn(`⚠️ Note: Could not download ${file} (${err.message}), continuing boot sequence anyway.`);
        }
    }
}

downloadFiles();
