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
    for (const particleName of PARTICLE_NAMES) {
      this.load.image(particleName, `assets/images/${particleName}.png?v=${version}`);
    }

    // Audio
    for (const soundName of SOUND_NAMES) {
      this.load.audio(soundName, `assets/audio/${soundName}.wav?v=${version}`);
    }
  }

  create() {
    // Sounds
    /** @type {{ [key: string]: Phaser.Sound }} */
    this.sounds = {};
    for (const soundName of SOUND_NAMES) {
      this.sounds[soundName] = this.game.add.audio(soundName);
      this.sounds[soundName].loopFull(0);
    }
    this.sounds["base"] = this.sounds["solar-solar-bed-1"];
    this.sounds["base"].volume = 0.5;

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
      const soundName = PARTICLE_TO_SOUND_MAP[particle.key];
      this.sounds.base.volume = 0;
      this.sounds[soundName].volume = 0.5;
    });
    this.particleEmitter.onChildInputUp.add((particle, pointer) => {
      const soundName = PARTICLE_TO_SOUND_MAP[particle.key];
      this.sounds.base.volume = 0.5;
      this.sounds[soundName].volume = 0;
    });

    // Unpause audio
    this.input.onUp.add(() => {
      if (this.sound.usingWebAudio && this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
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
