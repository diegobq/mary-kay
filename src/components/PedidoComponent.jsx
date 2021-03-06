import React from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import { LABELS } from '../constants';

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 500,
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: 2 * theme.spacing.unit,
  },
});

const Pedido = ({ classes, item, onSave, history }) => (
  <Form initialValues={item} onSubmit={onSave}>
    {({ handleSubmit }) => (
      <Modal
        className={classes.modal}
        onClose={() => history.goBack()}
        open
      >
        <Card className={classes.modalCard}>
          <form onSubmit={handleSubmit}>
            <CardContent className={classes.modalCardContent}>
              <Field name="cliente">
                {({ input }) => <TextField label="Cliente" autoFocus {...input} />}
              </Field>
              <Field name="description">
                {({ input }) => (
                  <TextField
                    className={classes.marginTop}
                    label="Descripción"
                    multiline
                    rows={4}
                    {...input}
                  />
                )}
              </Field>
              <Field name="fechaPedido">
                {({ input }) => (
                  <TextField
                    id="date"
                    label="Fecha (MM-DD-AAAA)"
                    type="date"
                    required={true}
                    className={classes.marginTop}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...input}
                  />
                )}
              </Field>
              <Field name="fechaEntregado">
                {({ input }) => (
                  <TextField
                    id="date"
                    label="Fecha Entregado (MM-DD-AAAA)"
                    type="date"
                    required={false}
                    className={classes.marginTop}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...input}
                  />
                )}
              </Field>
              <Field name="total">
                {({ input }) => (
                  <TextField
                    id="total"
                    label="Total"
                    className={classes.marginTop}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    {...input}
                  />
                )}
              </Field>
              <Field name="descuento">
                {({ input }) => (
                  <TextField
                    id="descuento"
                    label="Descuento"
                    className={classes.marginTop}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    {...input}
                  />
                )}
              </Field>
              <Field name="pagado">
                {({ input }) => (
                  <TextField
                    id="pagado"
                    label="Pagado"
                    className={classes.marginTop}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    {...input}
                  />
                )}
              </Field>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" type="submit">{LABELS.save}</Button>
              <Button size="small" onClick={() => history.goBack()}>{LABELS.cancel}</Button>
            </CardActions>
          </form>
        </Card>
      </Modal>
    )}
  </Form>
);

export default compose(
  withRouter,
  withStyles(styles),
)(Pedido);