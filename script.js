const repoOwner = 'sadoj-kuro';
const repoName = 'fivem-vehicle-templates';
const folderPath = 'templates'; // Le dossier où tu vas glisser tes fichiers

const grid = document.getElementById('templatesGrid');
const searchInput = document.getElementById('searchInput');

let templatesData = [];

async function fetchTemplates() {
    grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Chargement des templates depuis GitHub...</p>';
    
    try {
        // Utilisation de l'API Git Trees pour récupérer tous les fichiers (même dans les sous-dossiers) en 1 seule requête !
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/main?recursive=1`);
        
        if (!response.ok) {
            throw new Error('Erreur réseau de l\'API GitHub');
        }
        
        const data = await response.json();
        
        // On filtre pour ne garder que les fichiers dans le dossier "templates"
        const files = data.tree.filter(item => item.type === 'blob' && item.path.startsWith(folderPath + '/') && !item.path.endsWith('.gitkeep'));
        
        // On regroupe les fichiers par nom de base (ex: "police.zip" et "police.png" deviennent le même véhicule "police")
        const baseNames = new Set();
        files.forEach(file => {
            const fileName = file.path.split('/').pop(); // Récupère juste le nom du fichier à la fin du chemin
            const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
            baseNames.add(nameWithoutExt);
        });

        templatesData = Array.from(baseNames).map((baseName, index) => {
            // Fonction pour générer le lien de téléchargement direct
            const getRawUrl = (filePath) => `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`;

            // On cherche l'archive et l'image (en vérifiant la fin du nom de fichier)
            const archive = files.find(f => f.path.split('/').pop().startsWith(baseName + '.') && (f.path.endsWith('.zip') || f.path.endsWith('.rar') || f.path.endsWith('.7z') || f.path.endsWith('.ytd') || f.path.endsWith('.dds')));
            const image = files.find(f => f.path.split('/').pop().startsWith(baseName + '.') && (f.path.endsWith('.png') || f.path.endsWith('.jpg') || f.path.endsWith('.jpeg')));
            
            // On formate le titre (ex: "police_lspd" -> "Police Lspd")
            const title = baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const fileName = archive ? archive.path.split('/').pop() : baseName;

            return {
                id: index,
                title: title,
                downloadUrl: archive ? getRawUrl(archive.path) : (image ? getRawUrl(image.path) : null),
                imageUrl: image ? getRawUrl(image.path) : null,
                fileName: fileName,
                tags: baseName.toLowerCase().split(/[-_]/)
            };
        });

        // Tri alphabétique des templates
        templatesData.sort((a, b) => a.title.localeCompare(b.title));

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
            imageHtml = `<img src="${t.imageUrl}" alt="${t.title}" style="width: 100%; height: 220px; object-fit: contain; background: rgba(0,0,0,0.2); border-radius: 12px; margin-bottom: 1.5rem; padding: 0.5rem;">`;
        }

        let downloadBtn = `<p style="color: var(--text-secondary); text-align: center; font-size: 0.9rem; margin-top: auto;">Template manquant</p>`;
        if (t.downloadUrl) {
            downloadBtn = `<a href="${t.downloadUrl}" class="download-btn" target="_blank" download>Télécharger</a>`;
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
