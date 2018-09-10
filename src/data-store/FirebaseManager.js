import firebase from 'firebase';
import { Subject } from 'rxjs';

export class FirebaseManager {
  constructor() {
    this.docRef = firebase.firestore();

    this.docs = {
      pedidos: 'pedidos',
      clientes: 'clientes'
    };

    // create a Subject instance
    this.subject$ = new Subject();
  }

  getPedidos = () => {
    return this.get(this.docs.pedidos);
  };

  getClientes = () => {
    return this.get(this.docs.clientes);
  };

  savePedido = (item) => {
    return this.save(item, this.docs.pedidos);
  };

  saveCliente = (item) => {
    return this.save(item, this.docs.clientes);
  };

  deletePedido = (id) => {
    return this.deleteItem(id, this.docs.pedidos);
  };

  deleteCliente = (id) => {
    return this.deleteItem(id, this.docs.clientes);
  };

  get = (collectionName) => {
    this.docRef.collection(collectionName).onSnapshot((querySnapshot) => {
      let pedidos = [];
      querySnapshot.forEach((doc) => {
        let pedido  = {
          ...doc.data(),
          id: doc.id
        };
        pedidos.push(pedido);
      });
      this.subject$.next(pedidos);
    });

    return this.subject$;
  };

  save = (item, collectionName) => {
    let promise = new Promise((resolve, reject) => {
      let collection = this.docRef.collection(collectionName);
      if(item.id) { //update
        collection.doc(item.id).set(item).then((result) => {
          resolve(result);
        }).catch((error) => {
          console.log('Falla al ACTUALIZAR el "' + collectionName + "'");
          console.log(error);
          reject(error);
        });
      } else {  //new
        collection.add(item).then((result) => {
          resolve(result);
        }).catch((error) => {
          console.log('Falla al CREAR el "' + collectionName + '"');
          console.log(error);
          reject(error);
        });
      }
    });

    return promise;
  };

  deleteItem = (id, collectionName) => {
    let promise = new Promise((resolve, reject) => {
      let collection = this.docRef.collection(collectionName);
      collection.doc(id).delete().then((result) => {
        resolve(result);
      }).catch((error) => {
        console.log('Falla al ELIMINAR el "' + collectionName + '" con id: "' + id + '"');
        console.log(error);
        reject(error);
      });
    });

    return promise;
  };
}
