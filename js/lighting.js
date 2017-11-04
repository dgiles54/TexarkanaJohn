var LIGHT_RADIUS = 100;
var GLOW_RADIUS = 75;
var shadowTexture;

function loadShadowTexture() {
    // Create shadow texture
    shadowTexture = game.add.bitmapData(map.widthInPixels, map.heightInPixels);

    // Create object that uses bitmap as texture
    var lightSprite = game.add.image(0, 0, shadowTexture);

    // Set blend mode to multiply
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
}

// Create light sources
function updateShadowTexture() {
    // Draw shadow
    shadowTexture.context.fillStyle = 'rgb(35, 35, 35)';
    shadowTexture.context.fillRect(0, 0, map.widthInPixels, map.heightInPixels);

    // Player torch
    // Change radius randomly each frame
    var radius = LIGHT_RADIUS*1.5 + game.rnd.integerInRange(1, 10);

    // Draw circle of light with soft edge
    var gradient =
        shadowTexture.context.createRadialGradient(
            player.x, player.y, LIGHT_RADIUS * 0.1,
            player.x, player.y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 140, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradient;
    shadowTexture.context.arc(player.x, player.y, radius, 0, Math.PI * 2);
    shadowTexture.context.fill();

    // Torches in map
    torches.forEach(function (torch) {
        // Change radius randomly each frame
        var radius = LIGHT_RADIUS + game.rnd.integerInRange(1, 10);

        // Draw circle of light with soft edge
        var gradient =
            shadowTexture.context.createRadialGradient(
                torch.x, torch.y, LIGHT_RADIUS * 0.05,
                torch.x, torch.y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 140, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(torch.x, torch.y, radius, 0, Math.PI * 2);
        shadowTexture.context.fill();
    });

    // Lava glow
    map.objects['LavaGlow'].forEach(function (glowObject) {
        var gradient =
            shadowTexture.context.createRadialGradient(
                glowObject.x + 16, glowObject.y, GLOW_RADIUS * 0.05,
                glowObject.x + 16, glowObject.y, GLOW_RADIUS);
        gradient.addColorStop(0, 'rgba(250, 75, 50, 1.0)');
        gradient.addColorStop(1, 'rgba(250, 75, 50, 0.0)');

        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(glowObject.x + 16, glowObject.y, GLOW_RADIUS, 0, Math.PI * 2);
        shadowTexture.context.fill();
    });

    // Update texture cache
    shadowTexture.dirty = true;
}