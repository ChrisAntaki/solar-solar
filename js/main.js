class Sounds extends Phaser.State {
  init() {
    // Scaling
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.pageAlignVertically = true;

    // Keep going
    game.stage.disableVisibilityChange = true;
  }

  preload() {
    // Increment to bust caches
    const version = 1;

    // Images
    const images = [
      "particle-blue",
      "particle-blue-light",
      "particle-green",
      "squid",
    ];
    for (const name of images) {
      this.load.image(name, `assets/images/${name}.png?v=${version}`);
    }

    // Audio
    this.load.audio("hit", "assets/audio/hit.wav?v=" + version);
    this.load.audio("switch", "assets/audio/switch.wav?v=" + version);

    // Scripts
    this.load.script("constants", "js/constants.js");
  }

  create() {
    // Sound
    this.scoreSound = this.game.add.audio("hit");
    this.switchSound = this.game.add.audio("switch");

    // Particles
    this.particleEmitter = this.game.add.emitter(
      200,
      200,
      100
    );
    this.particleEmitter.makeParticles([
      "particle-blue",
      "particle-blue-light",
      "particle-green",
    ]);
    // this.particleEmitter.gravity = 200;
    this.particleEmitter.setAlpha(1, 0, PARTICLE_DURATION);
    this.particleEmitter.minParticleScale = 0.1;
    this.particleEmitter.maxParticleScale = 0.3;
    const spread = 200;
    this.particleEmitter.minParticleSpeed.setTo(-spread, -spread);
    this.particleEmitter.maxParticleSpeed.setTo(spread, spread);
    this.particleEmitter.setRotation(0, 0);
    this.particleEmitter.on = true;
    this.particleEmitter.setAllChildren("inputEnabled", true);
    this.particleEmitter.onChildInputDown.add((particle, pointer) => {
      console.log(particle.key);
      console.log("Down");
    });
    this.particleEmitter.onChildInputUp.add((particle, pointer) => {
      console.log(particle.key);
      console.log("Up");
    });
  }

  update() {
    this.lerp(this.particleEmitter, {
      x: this.world.centerX,
      y: this.world.centerY,
    })
  }

  lerp(sprite, position) {
    sprite.x = Phaser.Math.linearInterpolation([sprite.x, position.x], 0.5);
    sprite.y = Phaser.Math.linearInterpolation([sprite.y, position.y], 0.5);
  }
}

const game = new Phaser.Game({
  width: 600,
  height: 800,
  renderer: Phaser.CANVAS,
  transparent: true,
  state: Sounds,
});
