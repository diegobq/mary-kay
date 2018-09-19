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

import { green, pink } from '@material-ui/core/colors/';
import { Folder as FolderIcon, Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { isUndefined, find, orderBy } from 'lodash';
import { compose } from 'recompose';

import { DataManager } from '../data-store/DataManager';
import Orden from '../components/OrdenComponent';
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

class ClientesManager extends Component {
  constructor(props) {
    super(props);

    this.dataManager = new DataManager();
    this.route = ROUTES.orden;

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
    this.dataManager.saveOrden(item).then((result) => {
      this.props.history.goBack();
    }).catch((error) => {
      console.log(error);
    });
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

  renderEditor = ({ match: { params: { id, add } } }) => {
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
              {orderBy(this.state.items, ['fechaOrden'], ['desc']).map(item => (
                <ListItem key={item.id} button component={Link} to={`${this.route.path}/${item.id}/add`}>
                  {!item.fechaPedido && !item.fechaRecibido &&
                    <Avatar className={classes.avatar}>
                      <FolderIcon />
                    </Avatar>
                  }
                  {item.fechaPedido && !item.fechaRecibido &&
                    <Avatar className={classes.greenAvatar}>
                      <FolderIcon />
                    </Avatar>
                  }
                  {item.fechaPedido && item.fechaRecibido &&
                    <Avatar className={classes.pinkAvatar}>
                      <FolderIcon />
                    </Avatar>
                  }
                  <ListItemText
                    primary={`${MESES[moment(item.fechaOrden).format('MM')]} - ${moment(item.fechaOrden).format('YYYY')} - %${item.porcentaje} ${item.fechaPedido ? " - " + moment(item.fechaPedido).format('DD/MM/YYYY') : ""}`}
                    secondary={item.fechaRecibido && `Recibido: ${moment(item.fechaRecepcion).format('DD/MM/YYYY')}`}
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
              ))}
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
        <Route exact path={`${this.route.path}/:id/:add`} render={this.renderEditor} />
      </Fragment>
    );
  }
}

export default compose(
  withAuth,
  withRouter,
  withStyles(styles),
)(ClientesManager);
