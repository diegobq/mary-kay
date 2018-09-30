import firebase from 'firebase/app';
import 'firebase/firestore';
import { Subject } from 'rxjs';

export class FirebaseManager {
  constructor() {
    this.docRef = firebase.firestore();
    const settings = {
      timestampsInSnapshots: true
    };
    this.docRef.settings(settings);

    this.docs = {
      clientes: 'clientes',
      ordenes: 'ordenes',
      pedidos: 'pedidos',
    };

    // create a Subject instance
    this.subject$ = new Subject();
  }

  getClientes = () => {
    return this.get(this.docs.clientes);
  };

  saveCliente = (item) => {
    return this.save(item, this.docs.clientes);
  };

  deleteCliente = (id) => {
    return this.deleteItem(id, this.docs.clientes);
  };

  getOrden = (id) => {
    return this.getById(this.docs.ordenes, id);
  };

  getOrdenes = () => {
    return this.get(this.docs.ordenes);
  };

  saveOrden = (item) => {
    return this.save(item, this.docs.ordenes);
  };

  deleteOrden = (id) => {
    return this.deleteItem(id, this.docs.ordenes);
  };

  getPedidos = () => {
    return this.get(this.docs.pedidos);
  };

  savePedido = (item) => {
    return this.save(item, this.docs.pedidos);
  };

  deletePedido = (id) => {
    return this.deleteItem(id, this.docs.pedidos);
  };

  getById = (collectionName, id) => {
    this.docRef.collection(collectionName)
      .doc(id)
      .onSnapshot((querySnapshot) => {
        const document = {
          ...querySnapshot.data(),
          id: querySnapshot.id
        };
        this.subject$.next(document);
    });

    return this.subject$;
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
