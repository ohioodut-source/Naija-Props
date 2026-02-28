const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
    { id: 1, url: "https://images.unsplash.com/photo-1600596542815-22b5c1275efb?auto=format&fit=crop&w=800&q=80" },
    { id: 2, url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
    { id: 3, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
    { id: 4, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
    { id: 5, url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80" },
    { id: 6, url: "https://images.unsplash.com/photo-1605276374104-514b5da652d7?auto=format&fit=crop&w=800&q=80" },
    { id: 7, url: "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?auto=format&fit=crop&w=800&q=80" },
    { id: 8, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" },
    { id: 9, url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
    { id: 10, url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80" },
    { id: 'hero', url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('error', reject);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(filepath);
                });
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
};

async function downloadAll() {
    console.log("Starting download of images...");
    const dir = path.join('public', 'properties');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const img of images) {
        let filename = img.id === 'hero' ? '../hero.jpg' : `property-${img.id}.jpg`;
        const dest = path.join(dir, filename);

        try {
            await downloadImage(img.url, dest);
            console.log(`Downloaded ${dest}`);
        } catch (error) {
            console.error(`Failed to download ${img.id}:`, error.message);
        }
    }
    console.log("All downloads complete.");
}

downloadAll();
