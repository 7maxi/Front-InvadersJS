import Balas from "./Balas.js";

export default class BalasController {
  bullets = [];
  tiempoSiguienteBala = 0;

  constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
    this.canvas = canvas;
    this.maxBalas = maxBulletsAtATime;
    this.bulletColor = bulletColor;
    this.soundEnabled = soundEnabled;
    this.sonidoDisparo = new Audio("sonido/shoot.wav");
    this.sonidoDisparo.volume = 0.1;
  }

  draw(ctx) {
    this.bullets = this.bullets.filter(
        (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );


    ctx.shadowColor = this.bulletColor;
    ctx.shadowBlur = 10;

    this.bullets.forEach((bullet) => bullet.draw(ctx));

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    if (this.tiempoSiguienteBala > 0) {
      this.tiempoSiguienteBala--;
    }
  }

  collideWith(sprite) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }

    return false;
  }

  shoot(x, y, velocity, tiempoSiguienteBala = 0) {
    if (
        this.tiempoSiguienteBala <= 0 &&
        this.bullets.length < this.maxBalas
    ) {
      const bullet = new Balas(this.canvas, x, y, velocity * 2, this.bulletColor);
      this.bullets.push(bullet);
      if (this.soundEnabled) {
        this.sonidoDisparo.currentTime = 0;
        this.sonidoDisparo.play();
      }
      this.tiempoSiguienteBala = tiempoSiguienteBala;
    }
  }
}
