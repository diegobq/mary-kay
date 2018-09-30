import React, { Component, Fragment } from 'react';
import { withAuth } from '@okta/okta-react';
import { withRouter, Route, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch
} from '@material-ui/core';

import { green, pink } from '@material-ui/core/colors/';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { compose } from 'recompose';

import { isUndefined } from 'lodash';

import { DataManager } from '../data-store/DataManager';
import Pedido from '../components/PedidoComponent';
import { MESES, ROUTES } from '../constants';

const styles = theme => ({
  items: {
    marginTop: 2 * theme.spacing.unit,
  },
  fab: {
    position: 'absolute',
    bottom: 3 * theme.spacing.unit,
    right: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      bottom: 2 * theme.spacing.unit,
      right: 2 * theme.spacing.unit,
    },
  },
  avatar: {
    margin: 10,
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
});

class CargarOrdenManager extends Component {
  constructor(props) {
    super(props);

    this.dataManager = new DataManager();
    this.route = ROUTES.cargarOrden;
    this.index = -1;

    this.state = {
      loading: true,
      orden: {
        pedidos: []
      }
    };

    this.getItem();
  }

  getItem = () => {
    const params = this.props.location.pathname.split('/');
    const id = params[2];
    this.dataManager.getOrden(id).subscribe((data) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          loading: false,
          orden: data
        };
      });
    });
  };

  saveItemCallback = async (pedido) => {
    this.savePedido(pedido, true, this.index);
  };

  handleEntregado = (index) => {
    let orden = {
      ...this.state.orden
    };

    let pedido = orden.pedidos[index];
    pedido.fechaEntregado = pedido.fechaEntregado ? null : moment().format('YYYY-MM-DD');

    this.saveOrden(orden, false);
  };

  savePedido = (pedido, isEditing, index) => {
    let orden = {
      ...this.state.orden
    };

    if (isEditing) {  //new or edit
      if(isUndefined(pedido.fechaEntregado)) {
        pedido.fechaEntregado = null;
      }
      if (index === 'new') {  //agregar uno nuevo
        orden.pedidos.push(pedido);
      } else {  //editar
        orden.pedidos[index] = pedido;
      }
    } else {
      orden.pedidos.splice(index, 1);
    }
    this.saveOrden(orden, isEditing);
  };

  saveOrden = (orden, needGoBack) => {
    this.dataManager.saveOrden(orden).then(() => {
      this.setState((previousState) => {
        return {
          ...previousState,
          loading: false,
          orden
        };
      });
      if(needGoBack) {
        this.props.history.goBack();
      }
    }).catch((error) => {
      console.log('Fallo');
    });
  };

  async deleteItem(index) {
    if (window.confirm(`Estás seguro que queres borrar el pedido "${(index + 1)}"`)) {
      this.savePedido(null, false, index);
    }
  }

  renderEditor = ({ match: { params: { index } } }) => {
    if (this.state.loading) return null;
    this.index = index;
    let item = {
      fechaPedido: moment().format('YYYY-MM-DD')
    };

    if (index !== 'new') {
      item = this.state.orden.pedidos[index];
    }

    return <Pedido item={item} onSave={this.saveItemCallback} />;
  };

  render() {
    const { classes } = this.props;
    const { orden } = this.state;
    const pedidos = orden.pedidos || [];

    return (
      <Fragment>
        <Typography variant="display1">{`${this.route.label} - ${MESES[moment(orden.fechaOrden).format('MM')]} - ${moment(orden.fechaOrden).format('YYYY')} - ${orden.porcentaje}% ${orden.fechaPedido ? " - " + moment(orden.fechaPedido).format('DD/MM/YYYY') : ""}`}</Typography>
        {pedidos.length > 0 ? (
          <Paper elevation={1} className={classes.items}>
            <List>
              {pedidos.map((item, index) => (
                <ListItem key={index} button component={Link} to={`${this.route.path}/${orden.id}/add/${index}`}>
                  <Avatar className={item.fechaEntregado ? classes.pinkAvatar : classes.avatar}>{(index + 1)}</Avatar>
                  <ListItemText
                    primary={`${item.cliente} - ${item.description} - $${item.total} - $${item.pagado}`}
                    secondary={item.fechaPedido && `Pedido ${moment(item.fechaPedido).fromNow()} - ${moment(item.fechaPedido).format('DD/MM/YYYY')}`}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      onChange={() => { this.handleEntregado(index); }}
                      checked={!!item.fechaEntregado}
                    />
                    <IconButton onClick={() => this.deleteItem(index)} color="inherit">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          !this.state.loading && <Typography variant="subheading">{`No hay pedidos cargados.`}</Typography>
        )}
        <Button
          variant="fab"
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to={`${this.route.path}/${orden.id}/add/new`}
        >
          <AddIcon />
        </Button>
        <Route exact path={`${this.route.path}/:id/add/:index`} render={this.renderEditor} />
      </Fragment>
    );
  }
}

export default compose(
  withAuth,
  withRouter,
  withStyles(styles),
)(CargarOrdenManager);
