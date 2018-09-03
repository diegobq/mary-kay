import { FirebaseManager as DBManager } from './FirebaseManager';

export class DataManager {
  constructor() {
    this.dbManager = new DBManager();
  }

  getPedidos = () => {
    return this.dbManager.getPedidos();
  };

  savePedido = (pedido) => {
    return this.dbManager.savePedido(pedido);
  };

  deletePedido = (pedidoId) => {
    return this.dbManager.deletePedido(pedidoId);
  };
}
