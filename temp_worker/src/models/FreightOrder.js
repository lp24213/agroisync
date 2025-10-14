// Modelo FreightOrder - arquivo temporÃ¡rio para deploy
export default class FreightOrder {
  constructor(data) {
    Object.assign(this, data);
  }

  static findById(id) {
    return null;
  }

  static findByUser(userId) {
    return [];
  }

  static create(data) {
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
