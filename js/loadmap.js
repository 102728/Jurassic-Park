const mapData = {
    dinosaurs: {
        herbivores: {
            triceratops: { x: 64, y: 21 },
            brachiosaurus: [
                { x: 53, y: 36 },
                { x: 58, y: 51 }
            ],
            gallimimus: { x: 51, y: 42 },
            parasaurolophus: { x: 53, y: 48 },
            stegosaurus: { x: 68, y: 68 }
        },
        carnivores: {
            metriacanthosaurus: { x: 79, y: 17 },
            dilophosaurus: [
                { x: 57, y: 27 },
                { x: 47, y: 56 }
            ],
            tyrannosaurus: { x: 72, y: 29 },
            velociraptor: { x: 74, y: 39 },
            baryonyx: { x: 84, y: 41 },
            proceratosaurus: { x: 54, y: 59 },
            segisaurus: { x: 61, y: 81 }
        },
        flying: {
            pteranodon: { x: 59, y: 70 }
        }
    },
    buildings: {
        visitor_center: { x: 33, y: 42, icon: "building" },
        tour_station: { x: 44, y: 33, icon: "tourcar" },
        river_cruise: { x: 52, y: 65, icon: "tourboat" },
        helicopter_platform: { x: 73, y: 81, icon: "helicopter" },
        toilet: [
            { x: 61, y: 41, icon: "toilet" },
            { x: 73, y: 22, icon: "toilet" }
        ],
        harbor: [
            { x: 89, y: 54, icon: "harbor" },
            { x: 63, y: 7, icon: "harbor" }
        ],
    }
};

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function createMapIcon(type, name, x, y, iconClass = null) {
    const icon = document.createElement("ic");
    icon.className = iconClass || type;
    icon.style.position = "absolute";
    icon.style.left = `${x}%`;
    icon.style.top = `${y}%`;
    icon.style.cursor = "pointer";
    icon.dataset.type = type;
    icon.dataset.name = name;
    icon.dataset.originalX = x;
    icon.dataset.originalY = y;

    const urlParams = new URLSearchParams(window.location.search);
    const activeDino = urlParams.get("dino");
    if (activeDino === name) {
        icon.classList.add("active");
    }

    icon.addEventListener("click", () => handleIconClick(type, name));

    return icon;
}

function updateIconPositions() {
    const mapContainer = document.getElementById("rmap");
    if (!mapContainer) return;

    const icons = mapContainer.querySelectorAll("ic[data-original-x]");
    const containerRect = mapContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    const mapImage = new Image();
    mapImage.onload = function () {
        const imageAspectRatio = mapImage.naturalWidth / mapImage.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        let imageDisplayWidth, imageDisplayHeight;
        let imageOffsetX = 0, imageOffsetY = 0;

        if (containerAspectRatio > imageAspectRatio) {
            imageDisplayHeight = containerHeight;
            imageDisplayWidth = containerHeight * imageAspectRatio;
            imageOffsetX = (containerWidth - imageDisplayWidth) / 2;
        } else {
            imageDisplayWidth = containerWidth;
            imageDisplayHeight = containerWidth / imageAspectRatio;
            imageOffsetY = (containerHeight - imageDisplayHeight) / 2;
        }

        icons.forEach(icon => {
            const originalX = parseFloat(icon.dataset.originalX);
            const originalY = parseFloat(icon.dataset.originalY);

            const actualX = imageOffsetX + (originalX / 100) * imageDisplayWidth;
            const actualY = imageOffsetY + (originalY / 100) * imageDisplayHeight;

            icon.style.left = `${actualX}px`;
            icon.style.top = `${actualY}px`;
        });
    };

    mapImage.src = window.location.pathname.includes("/info/") ? "../images/rmap.png" : "images/rmap.png";
}

function handleIconClick(type, name) {
    if (window.location.pathname.includes("/info/")) {
        window.location.href = `./index.html?dino=${name}`;
    } else {
        window.location.href = `./info/index.html?dino=${name}`;
    }
}

function generateMapHtml() {
    const mapContainer = document.createElement("div");
    mapContainer.id = "rmap";
    mapContainer.className = "rmap";

    Object.entries(mapData.dinosaurs.herbivores).forEach(([name, pos]) => {
        if (Array.isArray(pos)) {
            pos.forEach(position => {
                mapContainer.appendChild(createMapIcon("herbivore", name, position.x, position.y));
            });
        } else {
            mapContainer.appendChild(createMapIcon("herbivore", name, pos.x, pos.y));
        }
    });

    Object.entries(mapData.dinosaurs.carnivores).forEach(([name, pos]) => {
        if (Array.isArray(pos)) {
            pos.forEach(position => {
                mapContainer.appendChild(createMapIcon("carnivore", name, position.x, position.y));
            });
        } else {
            mapContainer.appendChild(createMapIcon("carnivore", name, pos.x, pos.y));
        }
    });

    Object.entries(mapData.dinosaurs.flying).forEach(([name, pos]) => {
        if (Array.isArray(pos)) {
            pos.forEach(position => {
                mapContainer.appendChild(createMapIcon("flying", name, position.x, position.y));
            });
        } else {
            mapContainer.appendChild(createMapIcon("flying", name, pos.x, pos.y));
        }
    });

    Object.entries(mapData.buildings).forEach(([name, data]) => {
        if (Array.isArray(data)) {
            data.forEach(pos => {
                mapContainer.appendChild(createMapIcon("building", name, pos.x, pos.y, pos.icon));
            });
        } else {
            mapContainer.appendChild(createMapIcon("building", name, data.x, data.y, data.icon));
        }
    });

    const legend = document.createElement("dialog");
    legend.id = "legend";
    legend.className = "dialog-body col-span-4 legend";
    legend.innerHTML = `
        <ic class="herbivore"></ic>
        <span>Herbivore</span>
        <ic class="carnivore"></ic>
        <span>Carnivore</span>
        <ic class="flying"></ic>
        <span>Flying</span>
        <ic class="building"></ic>
        <span>Building</span>
        <ic class="helicopter"></ic>
        <span>Helicopter pad</span>
        <ic class="tourcar"></ic>
        <span>Tour car</span>
        <ic class="tourboat"></ic>
        <span>Tour boat</span>
        <ic class="toilet"></ic>
        <span>Toilet</span>
        <ic class="cabin"></ic>
        <span>Cabin</span>
    `;

    return { mapContainer, legend };
}

function loadMap() {
    let mapContainer = document.getElementById("map");

    if (!mapContainer) {
        console.error("Map container not found");
        return;
    }

    const { mapContainer: generatedMap, legend } = generateMapHtml();

    if (window.location.pathname.includes("/info/")) {
        mapContainer.appendChild(generatedMap);
        mapContainer.appendChild(legend);
    } else {
        mapContainer.appendChild(generatedMap);
        mapContainer.appendChild(legend);
    }

    const debouncedUpdate = debounce(updateIconPositions, 100);

    setTimeout(() => {
        updateIconPositions();
    }, 200);

    window.addEventListener("resize", debouncedUpdate);

    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(debouncedUpdate);
        resizeObserver.observe(generatedMap);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadMap();
});