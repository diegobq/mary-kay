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
import { AccountCircle as AccountIcon, Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { find, orderBy } from 'lodash';
import { compose } from 'recompose';

import { DataManager } from '../data-store/DataManager';
import Cliente from '../components/ClienteComponent';
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

class ClientesManager extends Component {
  constructor(props) {
    super(props);

    this.dataManager = new DataManager();
    this.route = ROUTES.cliente;

    this.state = {
      loading: true,
      items: []
    };
  }

  componentDidMount() {
    this.getItems();
  }

  getItems = () => {
    this.dataManager.getClientes().subscribe((data) => {
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
    this.dataManager.saveCliente(item).then((result) => {
      this.props.history.goBack();
    }).catch((error) => {
      console.log('Fallo');
    });
  };

  async deleteItem(item) {
    if (window.confirm(`Are you sure you want to delete "${item.description}"`)) {
      this.dataManager.deleteCliente(item.id);
    }
  }

  renderPostEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    const item = find(this.state.items, { id: id });

    if (!item && id !== 'new') return <Redirect to={ this.route.path } />;

    return <Cliente item={item} onSave={this.saveItem} />;
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="display1">{this.route.label}</Typography>
        {this.state.items.length > 0 ? (
          <Paper elevation={1} className={classes.items}>
            <List>
              {orderBy(this.state.items, ['fechaInicio', 'nombre'], ['nombre', 'asc']).map(item => (
                <ListItem key={item.id} button component={Link} to={`${this.route.path}/${item.id}`}>
                  <Avatar className={classes.greenAvatar}>
                    <AccountIcon />
                  </Avatar>
                  <ListItemText
                    primary={`${item.nombre} - ${item.telefono}`}
                    secondary={item.fechaInicio && `Inicio ${moment(item.fechaInicio).fromNow()} - ${moment(item.fechaInicio).format('DD/MM/YYYY')}`}
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
        <Route exact path={`${this.route.path}/:id`} render={this.renderPostEditor} />
      </Fragment>
    );
  }
}

export default compose(
  withAuth,
  withRouter,
  withStyles(styles),
)(ClientesManager);
