import React from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Modal,
  Button,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import { LABELS, PORCENTAJES } from '../constants';

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

const Orden = ({ classes, item, onSave, history }) => (
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
              <Field name="fechaOrden">
                {({ input }) => (
                  <TextField
                    id="fechaOrden"
                    label="Fecha Orden (MM-DD-AAAA)"
                    type="date"
                    required={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...input}
                  />
                )}
              </Field>
              <Field name="observaciones">
                {({ input }) => (
                  <TextField
                    className={classes.marginTop}
                    label="Observaciones"
                    multiline
                    rows={4}
                    {...input}
                  />
                )}
              </Field>
              <Field name="porcentaje">
                {({ input }) => (
                  <TextField
                    select
                    id="porcentaje"
                    label="Porcentaje"
                    className={classes.marginTop}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    {...input}
                  >
                    {PORCENTAJES.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
              <Field name="fechaPedido">
                {({ input }) => (
                  <TextField
                    id="fechaPedido"
                    label="Fecha Pedido (MM-DD-AAAA)"
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
              <Field name="fechaRecibido">
                {({ input }) => (
                  <TextField
                    id="fechaRecibido"
                    label="Fecha Recepción (MM-DD-AAAA)"
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
)(Orden);