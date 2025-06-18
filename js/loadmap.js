const mapHtml = `
<div id="rmap" class="rmap">
    <ic class="herbivore" style="position: absolute; top: 30%; left: 30%;"></ic>
</div>
<dialog id="legend" class="dialog-body col-span-4 legend">
    <ic class="herbivore"></ic>
    <span>Herbivore</span>
    <ic class="carnivore"></ic>
    <span>Carnivore</span>
    <ic class="flying"></ic>
    <span>Flying</span>
    <ic class="harbor"></ic>
    <span>Herbivore</span>
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
</dialog>
`;

function loadMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = mapHtml;
    } else {
        console.error('Map container not found');
    }
}