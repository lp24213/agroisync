// Modelo Chat - arquivo temporário para deploy
export default class Chat {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findById(id) {
    return null;
  }

  static async create(data) {
    return new Chat(data);
  }

  async save() {
    return this;
  }
}
