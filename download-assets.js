import fs from 'fs';
import path from 'path';

const buildDir = path.join(process.cwd(), 'www_static', 'clients', 'october_5_2017');

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

const filesToDownload = ['app.html', 'index.html']; 
// Updated to a working public asset archive mirror
const sourceBaseUrl = 'https://raw.githubusercontent.com/Old-Plunger/OldPlunger-Client-Archive/main/october_5_2017';

async function downloadFiles() {
    console.log("🛠️ Automatically downloading missing client files for Render deployment...");
    for (const file of filesToDownload) {
        const filePath = path.join(buildDir, file);
        if (fs.existsSync(filePath)) continue;

        try {
            const response = await fetch(`${sourceBaseUrl}/${file}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const fileStream = fs.createWriteStream(filePath);
            for await (const chunk of response.body) {
                fileStream.write(chunk);
            }
            fileStream.end();
            console.log(`✅ Downloaded: ${file}`);
        } catch (err) {
            console.error(`❌ Failed to download ${file}:`, err.message);
        }
    }
}

downloadFiles();
