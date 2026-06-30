const templates = [
    {
        id: 1,
        title: "Police Cruiser (LSPD)",
        description: "Template complet avec mapping des portes, toit et coffre. Résolution 4K.",
        tags: ["police", "lspd", "cruiser"]
    },
    {
        id: 2,
        title: "Ambulance EMS",
        description: "Modèle fourgon ambulance, idéal pour créer des livrées hôpital réalistes.",
        tags: ["ems", "ambulance", "hopital"]
    },
    {
        id: 3,
        title: "Audi RS6 (Banalisée)",
        description: "Template pour Audi RS6, parfait pour les unités d'intervention rapide ou banalisées.",
        tags: ["audi", "rs6", "banalise", "rapide"]
    },
    {
        id: 4,
        title: "Camion de Pompier",
        description: "Texture haute résolution pour le camion de pompier standard (Firetruck).",
        tags: ["pompier", "fire", "truck"]
    },
    {
        id: 5,
        title: "Hélicoptère de Police",
        description: "Template pour le Maverick de la police (Polmav).",
        tags: ["police", "helico", "polmav", "lspd"]
    },
    {
        id: 6,
        title: "Dépanneuse (Towtruck)",
        description: "Template pour dépanneuse flatbed, avec zones personnalisables pour le logo de l'entreprise.",
        tags: ["mécano", "depanneuse", "towtruck", "entreprise"]
    }
];

const grid = document.getElementById('templatesGrid');
const searchInput = document.getElementById('searchInput');

function renderTemplates(filter = "") {
    grid.innerHTML = "";
    
    const filteredTemplates = templates.filter(t => 
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
        
        card.innerHTML = `
            <div class="card-image-placeholder">Image du véhicule</div>
            <h2>${t.title}</h2>
            <p>${t.description}</p>
            <a href="#" class="download-btn" onclick="alert('Bientôt disponible !')">Télécharger</a>
        `;
        
        grid.appendChild(card);
    });
}

// Initial render
renderTemplates();

// Search listener
searchInput.addEventListener('input', (e) => {
    renderTemplates(e.target.value);
});
