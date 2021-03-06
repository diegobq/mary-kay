import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import { CargarOrdenPage, ClientePage, OrdenPage, PedidoPage } from './pages';
import { ROUTES } from './constants';

const styles = theme => ({
  main: {
    padding: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      padding: 2 * theme.spacing.unit,
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
  <CssBaseline />
  <AppHeader />
  <main className={classes.main}>
  </main>
    <Route exact path="/" component={Home} />
    <SecureRoute path={ ROUTES.orden.path } component={OrdenPage} />
    <SecureRoute path={ ROUTES.pedido.path } component={PedidoPage} />
    <SecureRoute path={ ROUTES.cliente.path } component={ClientePage} />
    <SecureRoute path={ ROUTES.cargarOrden.path } component={CargarOrdenPage} />
    <Route path="/implicit/callback" component={ImplicitCallback} />
  </Fragment>
);

export default withStyles(styles)(App);
