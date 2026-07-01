import fs from 'fs';
import path from 'path';
import { readableStreamToIterable } from 'stream/web'; // default in newer Node versions

const buildDir = path.join(process.cwd(), 'www_static', 'clients', 'october_5_2017');

// Ensure the nested directories exist
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

const filesToDownload = ['app.html', 'index.html']; 
// Base URL pointing to a verified public repository asset branch
const sourceBaseUrl = 'https://raw.githubusercontent.com/oldcordapp/OldCordV3/main/www_static/clients/october_5_2017';

async function downloadFiles() {
    console.log("🛠️ Automatically downloading missing client files for Render deployment...");
    for (const file of filesToDownload) {
        const filePath = path.join(buildDir, file);
        if (fs.existsSync(filePath)) continue;

        try {
            const response = await fetch(`${sourceBaseUrl}/${file}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const fileStream = fs.createWriteStream(filePath);
            for await (const chunk of readableStreamToIterable(response.body)) {
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
