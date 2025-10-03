// Modelo Chat - arquivo temporÃ¡rio para deploy
export default class Chat {
  constructor(data) {
    Object.assign(this, data);
  }

  static findById(id) {
    return null;
  }

  static create(data) {
    return new Chat(data);
  }

  save() {
    return this;
  }
}
