import React, { Component, Fragment } from 'react';
import { withAuth } from '@okta/okta-react';
import { withRouter, Route, Redirect, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { find, orderBy } from 'lodash';
import { compose } from 'recompose';

import { DataManager } from '../data-store/DataManager';
import Pedido from '../components/PedidoComponent';

const styles = theme => ({
  posts: {
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
});

class PedidosManager extends Component {
  constructor(props) {
    super(props);

    this.dataManager = new DataManager();

    this.state = {
      loading: true,
      pedidos: []
    };
  }

  componentDidMount() {
    this.getPedidos();
  }

  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`hola${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${await this.props.auth.getAccessToken()}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  getPedidos = () => {
    this.dataManager.getPedidos().subscribe((data) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          loading: false,
          pedidos: data
        };
      });
    });
  };

  savePedido = async (pedido) => {
    this.dataManager.savePedido(pedido).then((result) => {
      console.log('Pedido guardado');
    }).catch((error) => {
      console.log('Fallo');
    });
  };

  async deletePedido(pedido) {
    if (window.confirm(`Are you sure you want to delete "${pedido.description}"`)) {
      this.dataManager.deletePedido(pedido.id);
    }
  }

  renderPostEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    console.log(id);
    const post = find(this.state.pedidos, { id: id });
    console.log(post);

    if (!post && id !== 'new') return <Redirect to="/posts" />;

    return <Pedido post={post} onSave={this.savePedido} />;
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="display1">Pedidos</Typography>
        {this.state.pedidos.length > 0 ? (
          <Paper elevation={1} className={classes.posts}>
            <List>
              {orderBy(this.state.pedidos, ['updatedAt', 'description'], ['description', 'asc']).map(pedido => (
                <ListItem key={pedido.id} button component={Link} to={`/posts/${pedido.id}`}>
                  <ListItemText
                    primary={pedido.description}
                    secondary={pedido.updatedAt && `Updated ${moment(pedido.updatedAt).fromNow()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.deletePedido(pedido)} color="inherit">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          !this.state.loading && <Typography variant="subheading">No posts to display</Typography>
        )}
        <Button
          variant="fab"
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to="/posts/new"
        >
          <AddIcon />
        </Button>
        <Route exact path="/posts/:id" render={this.renderPostEditor} />
      </Fragment>
    );
  }
}

export default compose(
  withAuth,
  withRouter,
  withStyles(styles),
)(PedidosManager);
