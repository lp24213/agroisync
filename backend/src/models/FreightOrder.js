// Modelo FreightOrder - arquivo temporário para deploy
export default class FreightOrder {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findById(id) {
    return null;
  }

  static async findByUser(userId) {
    return [];
  }

  static async create(data) {
    return new FreightOrder(data);
  }

  async save() {
    return this;
  }

  async update(data) {
    Object.assign(this, data);
    return this;
  }
}
