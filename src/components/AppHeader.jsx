import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core';

import LoginButton from './LoginButton';
import { ROUTES } from '../constants';

const styles = {
  flex: {
    flex: 1,
  },
};

const AppHeader = ({ classes }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="title" color="inherit">
        Mary Kay
      </Typography>
      <Button color="inherit" component={Link} to="/">Inicio</Button>
      <Button color="inherit" component={Link} to={ ROUTES.pedido.path }>{ROUTES.pedido.label}</Button>
      <Button color="inherit" component={Link} to={ ROUTES.cliente.path }>{ROUTES.cliente.label}</Button>
      <div className={classes.flex} />
      <LoginButton />
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(AppHeader);
