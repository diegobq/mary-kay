import React, { Component, Fragment } from 'react';
import { withAuth } from '@okta/okta-react';
import { withRouter, Route, Redirect, Link } from 'react-router-dom';
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
} from '@material-ui/core';
import { SecureRoute } from '@okta/okta-react';

import { green, pink, blue } from '@material-ui/core/colors/';
import { Folder as FolderIcon, Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { isUndefined, find, orderBy } from 'lodash';
import { compose } from 'recompose';

import { DataManager } from '../data-store/DataManager';
import Orden from '../components/OrdenComponent';
import { CargarOrdenPage } from '../pages';
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
  blueAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: blue[500],
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
});

class OrdenManager extends Component {
  constructor(props) {
    super(props);

    this.dataManager = new DataManager();
    this.route = ROUTES.orden;
    this.detailRoute = ROUTES.cargarOrden;

    this.state = {
      loading: true,
      items: []
    };
  }

  componentDidMount() {
    this.getItems();
  }

  getItems = () => {
    this.dataManager.getOrdenes().subscribe((data) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          loading: false,
          items: data
        };
      });
    });
  };

  saveItem = async (item) => {
    if(isUndefined(item.fechaPedido)) {
      item.fechaPedido = null;
    }
    if(isUndefined(item.fechaRecibido)) {
      item.fechaRecibido = null;
    }
    if(isUndefined(item.pedidos)) {
      item.pedidos = [];
    }
    this.dataManager.saveOrden(item).then((result) => {
      this.props.history.goBack();
    }).catch((error) => {
      console.log(error);
    });
  };

  obtenerTotales = (orden) => {
    const porcentaje = parseFloat(orden.porcentaje);
    let totales = {
      totalMK: 0,
      porcentajeMK: porcentaje,
      porcentaje: (100 - porcentaje),
      total: 0,
      ganancia: 0,
      gananciaStr: '',
      pendienteStr: '',
      descuento: 0,
      pagado: 0,
      pedidos: orden.pedidos.length,
      entregadosStr: '0'
    };

    if(orden.pedidos) {
      let entregados = 0;
      orden.pedidos.forEach((pedido) => {
        const descuento = parseFloat(pedido.descuento);
        const pagado = parseFloat(pedido.pagado);
        const total = parseFloat(pedido.total);
        totales.descuento += descuento;
        totales.pagado += pagado;
        totales.total += total;
        entregados += (pedido.fechaEntregado ? 1 : 0);
      });
      if (orden.pedidos.length === 0) {
        totales.entregadosStr = 'Sin Pedidos';
      } else {
        totales.descuento = totales.descuento.toFixed(2);
        totales.pagado = totales.pagado.toFixed(2);
        totales.totalMK = (totales.total * totales.porcentajeMK * 0.01).toFixed(2);
        totales.ganancia = (totales.total - totales.totalMK - totales.descuento).toFixed(2);
        let pendiente = (totales.total - totales.pagado - totales.descuento).toFixed(2);

        totales.gananciaStr = ` - Ganancia $${totales.ganancia}`;
        totales.pendienteStr = ` - Pendiente ${pendiente}`;
        if (entregados === orden.pedidos.length) {
          totales.entregadosStr = 'Entregados: Todos';
        } else {
          totales.entregadosStr = `Entregados: ${entregados}/${totales.pedidos}`;
        }
      }
    }

    return totales
  };

  async deleteItem(item) {
    const orden = MESES[moment(item.fechaOrden).format('MM')];
    if (window.confirm(`Querés eliminar la orden de "${orden}"?`)) {
      this.dataManager.deleteOrden(item.id);
    }
  }

  async editItem(item) {
    this.props.history.push(`${this.route.path}/${item.id}`);
  }

  renderEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    let item = find(this.state.items, { id: id });

    if (!item && id !== 'new') return <Redirect to={ this.route.path } />;

    if (!item && id === 'new') {
      item = {
        fechaOrden: moment().format('YYYY-MM-DD'),
        fechaPedido: moment().format('YYYY-MM-DD')
      }
    }

    return <Orden item={item} onSave={this.saveItem} />;
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="display1">{this.route.label}</Typography>
        {this.state.items.length > 0 ? (
          <Paper elevation={1} className={classes.items}>
            <List>
              {orderBy(this.state.items, ['fechaOrden'], ['desc']).map(item => {
                const totales = this.obtenerTotales(item);

                return (
                  <ListItem key={item.id} button component={Link} to={`${this.detailRoute.path}/${item.id}`}>
                    {!item.fechaPedido && !item.fechaRecibido &&
                    <Avatar className={classes.greenAvatar}>
                      <FolderIcon />
                    </Avatar>
                    }
                    {item.fechaPedido && !item.fechaRecibido &&
                    <Avatar className={classes.blueAvatar}>
                      <FolderIcon />
                    </Avatar>
                    }
                    {item.fechaPedido && item.fechaRecibido &&
                    <Avatar className={classes.pinkAvatar}>
                      <FolderIcon />
                    </Avatar>
                    }
                    <ListItemText
                      primary={`${MESES[moment(item.fechaOrden).format('MM')]} ${moment(item.fechaOrden).format('YYYY')} (${item.porcentaje}%) ${item.fechaPedido ? " - " + moment(item.fechaPedido).format('DD/MM/YYYY') : ""} ${totales.gananciaStr} - ${totales.entregadosStr}`}
                      secondary={`Total $${totales.total} - Descuento $${totales.descuento} - Mary Kay $${totales.totalMK} - Pagado $${totales.pagado} ${totales.pendienteStr}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => this.editItem(item)} color="inherit">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => this.deleteItem(item)} color="inherit">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        ) : (
          !this.state.loading && <Typography variant="subheading">{`No hay ${this.route.label} cargados.`}</Typography>
        )}
        <Button
          variant="fab"
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to={`${this.route.path}/new`}
        >
          <AddIcon />
        </Button>
        <Route exact path={`${this.route.path}/:id`} render={this.renderEditor} />
        <SecureRoute exact path={`${this.route.path}/:id/add`} component={CargarOrdenPage} />
      </Fragment>
    );
  }
}

export default compose(
  withAuth,
  withRouter,
  withStyles(styles),
)(OrdenManager);
