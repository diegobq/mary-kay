import { FirebaseManager as DBManager } from './FirebaseManager';

export class DataManager {
  constructor() {
    this.dbManager = new DBManager();
  }

  getPedidos = () => {
    return this.dbManager.getPedidos();
  };

  savePedido = (item) => {
    return this.dbManager.savePedido(item);
  };

  deletePedido = (itemId) => {
    return this.dbManager.deletePedido(itemId);
  };

  getClientes = () => {
    return this.dbManager.getClientes();
  };

  saveCliente = (item) => {
    return this.dbManager.saveCliente(item);
  };

  deleteCliente = (itemId) => {
    return this.dbManager.deleteCliente(itemId);
  };
}
