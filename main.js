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

// ================= LOGIN =================

class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
  }

  create() {
    const W = this.scale.width;

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

// ================= MENU =================

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const W = this.scale.width;

    this.cameras.main.setBackgroundColor("#102a5c");

    this.add.text(
      W / 2,
      100,
      "🐱 KUCING PINTAR",
      {
        fontSize: "50px",
        color: "#ffffff"
      }
    ).setOrigin(0.5);

    this.add.text(
      W / 2,
      170,
      "Petualangan Dunia Kucing",
      {
        fontSize: "24px",
        color: "#ffd700"
      }
    ).setOrigin(0.5);

    const playBtn = this.add.text(
      W / 2,
      300,
      "▶ MAINKAN",
      {
        fontSize: "34px",
        backgroundColor: "#7b2fff",
        padding: 15
      }
    )
    .setOrigin(0.5)
    .setInteractive();

    playBtn.on("pointerdown", () => {
      this.scene.start("HeroSelectScene");
    });
  }
}

// ================= PILIH HERO =================

class HeroSelectScene extends Phaser.Scene {
  constructor() {
    super("HeroSelectScene");
  }

  create() {
    const W = this.scale.width;

    this.cameras.main.setBackgroundColor("#111827");

    this.add.text(
      W / 2,
      60,
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
        hero.emoji + "\n\n" + name,
        {
          fontSize: "50px",
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

        this.scene.start(
          "HeroProfileScene"
        );

      });

    });
  }
}

// ================= PROFIL HERO =================

class HeroProfileScene extends Phaser.Scene {
  constructor() {
    super("HeroProfileScene");
  }

  create() {

    const W = this.scale.width;

    const heroName =
      localStorage.getItem("selectedHero");

    const hero =
      HEROES[heroName];

    this.cameras.main.setBackgroundColor("#0f172a");

    this.add.text(
      W / 2,
      100,
      hero.emoji,
      {
        fontSize: "120px"
      }
    ).setOrigin(0.5);

    this.add.text(
      W / 2,
      220,
      heroName,
      {
        fontSize: "42px",
        color: "#ffffff"
      }
    ).setOrigin(0.5);

    this.add.text(
      W / 2,
      360,

      "Type : " + hero.type +
      "\nSpeed : " + hero.speed +
      "\nEnergy : " + hero.energy +
      "\n\nSkill : " + hero.skill,

      {
        fontSize: "28px",
        color: "#ffffff",
        align: "center"
      }

    ).setOrigin(0.5);

    const startBtn = this.add.text(
      W / 2,
      540,
      "MULAI PETUALANGAN",
      {
        fontSize: "26px",
        backgroundColor: "#16a34a",
        padding: 15
      }
    )
    .setOrigin(0.5)
    .setInteractive();

    startBtn.on("pointerdown", () => {

      alert(
        "Map Petualangan akan dibuat berikutnya!"
      );

    });

  }
}

// ================= CONFIG =================

const config = {

  type: Phaser.AUTO,

  width: 900,
  height: 600,

  scene: [
    LoginScene,
    MainMenuScene,
    HeroSelectScene,
    HeroProfileScene
  ],

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }

};

new Phaser.Game(config);
