const repoOwner = 'sadoj-kuro';
const repoName = 'fivem-vehicle-templates';
const folderPath = 'templates'; // Le dossier où tu vas glisser tes fichiers

const grid = document.getElementById('templatesGrid');
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.getElementById('pagination');
const templateCounter = document.getElementById('templateCounter');
const scrollTopBtn = document.getElementById('scrollTopBtn');

let templatesData = [];
let currentPage = 1;
const itemsPerPage = 18;

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

        // Mise à jour du compteur
        if(templateCounter) {
            templateCounter.innerHTML = `<strong>${templatesData.length}</strong> templates disponibles.`;
        }

        renderTemplates();

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #ef4444;">Erreur lors de la récupération des fichiers. Vérifiez la limite d\'API GitHub ou votre connexion.</p>';
    }
}

function renderTemplates(filter = "") {
    grid.innerHTML = "";
    paginationContainer.innerHTML = "";
    
    const filteredTemplates = templatesData.filter(t => 
        t.title.toLowerCase().includes(filter.toLowerCase()) || 
        t.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filteredTemplates.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Aucun template trouvé.</p>`;
        return;
    }

    // Calcul de la pagination
    const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

    paginatedTemplates.forEach(t => {
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

    setupPagination(totalPages, filter);
}

function setupPagination(totalPages, filter) {
    if (totalPages <= 1) return; // Pas besoin de pagination pour 1 seule page

    const createBtn = (text, pageNum, disabled = false, active = false) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = 'page-btn';
        if (active) btn.classList.add('active');
        if (disabled) {
            btn.disabled = true;
            btn.classList.add('disabled');
        } else {
            btn.addEventListener('click', () => {
                currentPage = pageNum;
                renderTemplates(filter);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        return btn;
    };

    // Bouton Précédent
    paginationContainer.appendChild(createBtn('«', currentPage - 1, currentPage === 1));

    // Numéros de page (simplifiés pour ne pas afficher 20 boutons)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationContainer.appendChild(createBtn('1', 1));
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.innerText = '...';
            dots.className = 'page-dots';
            paginationContainer.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createBtn(i, i, false, i === currentPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.innerText = '...';
            dots.className = 'page-dots';
            paginationContainer.appendChild(dots);
        }
        paginationContainer.appendChild(createBtn(totalPages, totalPages));
    }

    // Bouton Suivant
    paginationContainer.appendChild(createBtn('»', currentPage + 1, currentPage === totalPages));
}

// Initialisation
fetchTemplates();

// Search listener
searchInput.addEventListener('input', (e) => {
    currentPage = 1; // Retour à la page 1 si on cherche
    renderTemplates(e.target.value);
});

// Scroll to top listener
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.add('visible');
        scrollTopBtn.classList.remove('visible'); // Quick fix
        if (window.scrollY <= 300) {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
