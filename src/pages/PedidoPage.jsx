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
import { Assignment as AssignmentIcon, Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { find, orderBy } from 'lodash';
import { compose } from 'recompose';

import { DataManager } from '../data-store/DataManager';
import Pedido from '../components/PedidoComponent';
import { ROUTES } from '../constants';

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

class PedidosManager extends Component {
  constructor(props) {
    super(props);

    this.dataManager = new DataManager();
    this.route = ROUTES.pedido;

    this.state = {
      loading: true,
      items: []
    };
  }

  componentDidMount() {
    this.getItems();
  }

  getItems = () => {
    this.dataManager.getPedidos().subscribe((data) => {
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
    this.dataManager.savePedido(item).then((result) => {
      this.props.history.goBack();
    }).catch((error) => {
      console.log('Fallo');
    });
  };

  async deleteItem(item) {
    if (window.confirm(`Are you sure you want to delete "${item.description}"`)) {
      this.dataManager.deletePedido(item.id);
    }
  }

  renderEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    let item = find(this.state.items, { id: id });

    if (!item && id !== 'new') return <Redirect to={ this.route.path } />;
    if (!item && id === 'new') {
      item = {
        fechaPedido: moment().format('YYYY-MM-DD')
      };
    }

    return <Pedido item={item} onSave={this.saveItem} />;
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="display1">{this.route.label}</Typography>
        {this.state.items.length > 0 ? (
          <Paper elevation={1} className={classes.items}>
            <List>
              {orderBy(this.state.items, ['fechaPedido', 'description'], ['description', 'asc']).map(item => (
                <ListItem key={item.id} button component={Link} to={`${this.route.path}/${item.id}`}>
                  <Avatar className={classes.greenAvatar}>
                    <AssignmentIcon />
                  </Avatar>
                  <ListItemText
                    primary={`${item.cliente} - ${item.description} - $${item.total} - $${item.pagado}`}
                    secondary={item.fechaPedido && `Pedido ${moment(item.fechaPedido).fromNow()} - ${moment(item.fechaPedido).format('DD/MM/YYYY')}`}
                  />
                  <ListItemSecondaryAction>
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
      </Fragment>
    );
  }
}

export default compose(
  withAuth,
  withRouter,
  withStyles(styles),
)(PedidosManager);
