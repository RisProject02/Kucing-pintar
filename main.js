const HEROES = {
Mimi: {
emoji: "🐱",
type: "Balanced",
speed: 180,
energy: 100,
skill: "Moon Slash"
},

Kuro: {
emoji: "😼",
type: "Fast",
speed: 260,
energy: 80,
skill: "Shadow Dash"
},

Snow: {
emoji: "🤍",
type: "Tank",
speed: 130,
energy: 120,
skill: "Ice Shield"
}
};

// ==================== LOGIN ====================

class LoginScene extends Phaser.Scene {

constructor() {
super("LoginScene");
}

create() {

const W = this.scale.width;
const H = this.scale.height;

this.cameras.main.setBackgroundColor("#1a0533");

this.add.text(
  W / 2,
  80,
  "🐱 KUCING PINTAR",
  {
    fontSize: "42px",
    color: "#ffffff"
  }
).setOrigin(0.5);

this.add.text(
  W / 2,
  180,
  "Username : admin",
  {
    fontSize: "24px",
    color: "#ffffff"
  }
).setOrigin(0.5);

this.add.text(
  W / 2,
  230,
  "Password : kucing123",
  {
    fontSize: "24px",
    color: "#ffffff"
  }
).setOrigin(0.5);

const btn = this.add.text(
  W / 2,
  350,
  "LOGIN",
  {
    fontSize: "32px",
    backgroundColor: "#7b2fff",
    padding: {
      left: 20,
      right: 20,
      top: 10,
      bottom: 10
    }
  }
)
  .setOrigin(0.5)
  .setInteractive();

btn.on("pointerdown", () => {
  this.scene.start("MainMenuScene");
});

}

}

// ==================== MENU ====================

class MainMenuScene extends Phaser.Scene {

constructor() {
super("MainMenuScene");
}

create() {

const W = this.scale.width;
const H = this.scale.height;

this.cameras.main.setBackgroundColor("#0d2b6b");

this.add.text(
  W / 2,
  100,
  "🐱 KUCING PINTAR",
  {
    fontSize: "48px",
    color: "#ffffff"
  }
).setOrigin(0.5);

const playBtn = this.add.text(
  W / 2,
  260,
  "▶ MAINKAN",
  {
    fontSize: "30px",
    backgroundColor: "#7b2fff",
    padding: 12
  }
)
  .setOrigin(0.5)
  .setInteractive();

playBtn.on("pointerdown", () => {
  this.scene.start("HeroSelectScene");
});

}

}

// ==================== HERO SELECT ====================

class HeroSelectScene extends Phaser.Scene {

constructor() {
super("HeroSelectScene");
}

create() {

const W = this.scale.width;

this.cameras.main.setBackgroundColor("#111827");

this.add.text(
  W / 2,
  70,
  "PILIH HERO",
  {
    fontSize: "42px",
    color: "#ffffff"
  }
).setOrigin(0.5);

const heroes = ["Mimi", "Kuro", "Snow"];

heroes.forEach((name, index) => {

  const hero = HEROES[name];

  const btn = this.add.text(
    180 + (index * 260),
    260,
    hero.emoji + "\n" + name,
    {
      fontSize: "60px",
      align: "center",
      backgroundColor: "#333333",
      padding: 20
    }
  )
    .setOrigin(0.5)
    .setInteractive();

  btn.on("pointerdown", () => {

    localStorage.setItem(
      "selectedHero",
      name
    );

    alert(name + " dipilih");

  });

});

}

}

// ==================== CONFIG ====================

const config = {

type: Phaser.AUTO,

width: 900,
height: 600,

scene: [
LoginScene,
MainMenuScene,
HeroSelectScene
],

scale: {
mode: Phaser.Scale.FIT,
autoCenter: Phaser.Scale.CENTER_BOTH
}

};

new Phaser.Game(config);
