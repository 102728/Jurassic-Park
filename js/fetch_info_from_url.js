async function loadContentData() {
    try {
        const response = await fetch("../content.json");
        return await response.json();
    } catch (error) {
        console.error("Error loading content data:", error);
        return null;
    }
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function findDinosaurData(contentData, dinoName) {
    if (!contentData || !contentData.dinosaurs) return null;
    
    const categories = ["herbivores", "carnivores", "flying"];
    
    for (const category of categories) {
        if (contentData.dinosaurs[category] && contentData.dinosaurs[category][dinoName]) {
            return {
                data: contentData.dinosaurs[category][dinoName],
                category: category
            };
        }
    }
    return null;
}

function findBuildingData(contentData, buildingName) {
    if (!contentData || !contentData.buildings) return null;
    
    if (contentData.buildings[buildingName]) {
        return {
            data: contentData.buildings[buildingName],
            category: "building"
        };
    }
    return null;
}

function updatePageContent(name, itemData, category) {
    const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " ");
    
    document.getElementById("page-title").textContent = displayName;
    document.getElementById("inf-name").textContent = displayName;
    document.getElementById("inf-name-sidebar").textContent = displayName;
    
    if (itemData.description) {
        document.getElementById("inf-overview").textContent = itemData.description;
    }
    
    if (category !== "building") {
        document.getElementById("inf-scientific-name").textContent = itemData.species ? itemData.species.join(", ") : "-";
        document.getElementById("inf-period").textContent = itemData.period || "-";
        document.getElementById("inf-diet").textContent = itemData.diet || "-";
        document.getElementById("inf-zone").textContent = itemData.location || "-";
        document.getElementById("inf-enclosure").textContent = "-";
        
        const imagePath = getImagePath(name, category);
        document.getElementById("inf-img").src = imagePath;
        document.getElementById("inf-img-sidebar").src = imagePath;
    } else {
        const infoRows = document.querySelectorAll(".infobox-section");
        if (infoRows.length > 0) {
            infoRows[0].style.display = "none";
        }
        if (infoRows.length > 1) {
            const parkSection = infoRows[1];
            parkSection.querySelector("h4").textContent = "Building Information";
            
            const tableBody = parkSection.querySelector("tbody");
            tableBody.innerHTML = `
                <tr class="infobox-row">
                    <td class="infobox-label">Type</td>
                    <td class="infobox-data">${itemData.type || "-"}</td>
                </tr>
                <tr class="infobox-row">
                    <td class="infobox-label">Capacity</td>
                    <td class="infobox-data">${itemData.capacity ? itemData.capacity + " people" : "-"}</td>
                </tr>
            `;
        }
        
        const imagePath = getBuildingImagePath(name);
        document.getElementById("inf-img").src = imagePath;
        document.getElementById("inf-img-sidebar").src = imagePath;
    }
}

function getImagePath(dinoName, category) {
    const categoryFolder = category === "herbivores" ? "herbivores" : 
                          category === "carnivores" ? "carnivores" : "pteranodon";
    
    const imageExtensions = ["jpg", "webp", "avif", "png"];
    
    for (const ext of imageExtensions) {
        const imagePath = `../media/dinopics/${categoryFolder}/${dinoName}.${ext}`;
        return imagePath;
    }
    
    return "../media/dinopics/herbivores/brachiosaurus.jpg";
}

function getBuildingImagePath(buildingName) {
    const imageExtensions = ["jpg", "webp", "png"];
    
    for (const ext of imageExtensions) {
        const imagePath = `../media/buildingpics/${buildingName}.${ext}`;
        return imagePath;
    }
    
    return "../media/buildingpics/visitor_center.png";
}

async function initializePage() {
    const dinoName = getUrlParameter("dino");
    
    if (!dinoName) {
        window.location.href = "../index.html";
        return;
    }
    
    const contentData = await loadContentData();
    
    if (!contentData) {
        window.location.href = "../index.html";
        return;
    }
    
    let result = findDinosaurData(contentData, dinoName);
    
    if (!result) {
        result = findBuildingData(contentData, dinoName);
    }
    
    if (result) {
        updatePageContent(dinoName, result.data, result.category);
    } else {
        window.location.href = "../index.html";
        return;
    }
}

document.addEventListener("DOMContentLoaded", initializePage);
