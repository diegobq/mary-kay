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
      <Button color="inherit" component={Link} to="/posts">Pedidos</Button>
      <div className={classes.flex} />
      <LoginButton />
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(AppHeader);
