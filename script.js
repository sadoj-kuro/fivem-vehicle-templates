const repoOwner = 'sadoj-kuro';
const repoName = 'fivem-vehicle-templates';
const folderPath = 'templates'; // Le dossier où tu vas glisser tes fichiers

const grid = document.getElementById('templatesGrid');
const searchInput = document.getElementById('searchInput');

let templatesData = [];

async function fetchTemplates() {
    grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Chargement des templates depuis GitHub...</p>';
    
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                 grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Le dossier <strong>${folderPath}</strong> est vide ou n'existe pas encore sur GitHub.</p>`;
                 return;
            }
            throw new Error('Erreur réseau de l\'API GitHub');
        }
        
        const files = await response.json();
        
        // On regroupe les fichiers par nom de base (ex: "police.zip" et "police.png" deviennent le même véhicule "police")
        const baseNames = new Set();
        files.forEach(file => {
            if(file.type === 'file' && file.name !== '.gitkeep') {
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                baseNames.add(nameWithoutExt);
            }
        });

        templatesData = Array.from(baseNames).map((baseName, index) => {
            // On cherche l'archive (zip, rar, 7z)
            const archive = files.find(f => f.name.startsWith(baseName + '.') && (f.name.endsWith('.zip') || f.name.endsWith('.rar') || f.name.endsWith('.7z') || f.name.endsWith('.ytd')));
            
            // On cherche l'image (png, jpg, jpeg)
            const image = files.find(f => f.name.startsWith(baseName + '.') && (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')));
            
            // On formate le titre (ex: "police_lspd" -> "Police Lspd")
            const title = baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return {
                id: index,
                title: title,
                downloadUrl: archive ? archive.download_url : null,
                imageUrl: image ? image.download_url : null,
                fileName: archive ? archive.name : baseName,
                tags: baseName.toLowerCase().split(/[-_]/)
            };
        });

        renderTemplates();

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #ef4444;">Erreur lors de la récupération des fichiers. Vérifiez la limite d\'API GitHub ou votre connexion.</p>';
    }
}

function renderTemplates(filter = "") {
    grid.innerHTML = "";
    
    const filteredTemplates = templatesData.filter(t => 
        t.title.toLowerCase().includes(filter.toLowerCase()) || 
        t.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filteredTemplates.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Aucun template trouvé.</p>`;
        return;
    }

    filteredTemplates.forEach(t => {
        const card = document.createElement('div');
        card.className = 'template-card';
        
        let imageHtml = `<div class="card-image-placeholder">Aucune image</div>`;
        if (t.imageUrl) {
            imageHtml = `<img src="${t.imageUrl}" alt="${t.title}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;">`;
        }

        let downloadBtn = `<p style="color: var(--text-secondary); text-align: center; font-size: 0.9rem; margin-top: auto;">Fichier 3D/Texture manquant</p>`;
        if (t.downloadUrl) {
            downloadBtn = `<a href="${t.downloadUrl}" class="download-btn" target="_blank">Télécharger</a>`;
        }
        
        card.innerHTML = `
            ${imageHtml}
            <h2>${t.title}</h2>
            <p style="margin-bottom: 1rem;">Fichier : <code>${t.fileName}</code></p>
            ${downloadBtn}
        `;
        
        grid.appendChild(card);
    });
}

// Initialisation
fetchTemplates();

// Search listener
searchInput.addEventListener('input', (e) => {
    renderTemplates(e.target.value);
});
