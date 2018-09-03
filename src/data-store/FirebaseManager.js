import firebase from 'firebase';
import { Subject } from 'rxjs';

export class FirebaseManager {
  constructor() {
    this.docRef = firebase.firestore();

    this.docs = {
      pedidos: 'pedidos'
    };

    // create a Subject instance
    this.subject$ = new Subject();
  }

  getPedidos = () => {
    return this.get(this.docs.pedidos);
  };

  savePedido = (pedido) => {
    let promise = new Promise((resolve, reject) => {
      let collection = this.docRef.collection(this.docs.pedidos);
      if(pedido.id) { //update
        collection.doc(pedido.id).set(pedido).then((result) => {
          resolve(result);
        }).catch((error) => {
          console.log('Falla al ACTUALIZAR el pedido');
          console.log(error);
          reject(error);
        });
      } else {  //new
        collection.add(pedido).then((result) => {
          resolve(result);
        }).catch((error) => {
          console.log('Falla al CREAR el pedido');
          console.log(error);
          reject(error);
        });
      }
    });

    return promise;
  };

  deletePedido = (pedidoId) => {
    let promise = new Promise((resolve, reject) => {
      let collection = this.docRef.collection(this.docs.pedidos);
      collection.doc(pedidoId).delete().then((result) => {
        resolve(result);
      }).catch((error) => {
        console.log('Falla al ELIMINAR el pedido');
        console.log(error);
        reject(error);
      });
    });

    return promise;
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
}
