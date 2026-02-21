// Inheritance Example - OOP Concept

// Base Class (Parent)
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Hi, I am ${this.name} and I am ${this.age} years old.`;
  }

  getDetails() {
    return {
      name: this.name,
      age: this.age
    };
  }
}

// Derived Class 1 (Child) - Extends Person
class Ismaeel extends Person {
  constructor(name, age, occupation) {
    super(name, age); // Calling parent constructor
    this.occupation = occupation;
  }

  introduce() {
    return `${super.introduce()} I work as a ${this.occupation}.`;
  }

  getOccupation() {
    return this.occupation;
  }
}

// Derived Class 2 (Child) - Extends Person
class Misbaah extends Person {
  constructor(name, age, hobby) {
    super(name, age);
    this.hobby = hobby;
  }

  introduce() {
    return `${super.introduce()} I enjoy ${this.hobby}.`;
  }

  getHobby() {
    return this.hobby;
  }
}

// Derived Class 3 (Child) - Extends Person
class Bhumika extends Person {
  constructor(name, age, profession) {
    super(name, age);
    this.profession = profession;
  }

  introduce() {
    return `${super.introduce()} My profession is ${this.profession}.`;
  }

  getProfession() {
    return this.profession;
  }
}

// Derived Class 4 (Child) - Extends Person
class Aftab extends Person {
  constructor(name, age, skill) {
    super(name, age);
    this.skill = skill;
  }

  introduce() {
    return `${super.introduce()} I am skilled in ${this.skill}.`;
  }

  getSkill() {
    return this.skill;
  }
}

// Usage Example
console.log("=== Inheritance Example ===\n");

const ismaeel = new Ismaeel("Ismaeel", 25, "Software Developer");
const misbaah = new Misbaah("Misbaah", 23, "painting");
const bhumika = new Bhumika("Bhumika", 24, "Designer");
const aftab = new Aftab("Aftab", 26, "Data Analysis");

console.log(ismaeel.introduce());
console.log(misbaah.introduce());
console.log(bhumika.introduce());
console.log(aftab.introduce());

console.log("\n=== Demonstrating Inheritance ===");
console.log("All classes inherit from Person class");
console.log("ismaeel instanceof Person:", ismaeel instanceof Person);
console.log("misbaah instanceof Person:", misbaah instanceof Person);
console.log("bhumika instanceof Person:", bhumika instanceof Person);
console.log("aftab instanceof Person:", aftab instanceof Person);

export { Person, Ismaeel, Misbaah, Bhumika, Aftab };
