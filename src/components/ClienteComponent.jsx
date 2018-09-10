import React from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  TextField,
} from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import moment from 'moment';

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

const todayStr = moment().format('YYYY-MM-DD');

const Cliente = ({ classes, item, onSave, history }) => (
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
              <Field name="nombre">
                {({ input }) => <TextField label="Nombre y Apellido" autoFocus {...input} />}
              </Field>
              <Field name="tonoPiel">
                {({ input }) => <TextField label="Tono Piel" className={classes.marginTop} autoFocus {...input} />}
              </Field>
              <Field name="tipoPiel">
                {({ input }) => <TextField label="Tipo Piel"className={classes.marginTop} autoFocus {...input} />}
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
              <Field name="telefono">
                {({ input }) => <TextField label="Teléfono" className={classes.marginTop} autoFocus {...input} />}
              </Field>
              <Field name="direccion">
                {({ input }) => <TextField label="Dirección" className={classes.marginTop} autoFocus {...input} />}
              </Field>
              <Field name="fechaInicio">
                {({ input }) => (
                  <TextField
                    id="date"
                    label="Fecha Inicio (MM-DD-AAAA)"
                    type="date"
                    defaultValue={todayStr}
                    required={true}
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
              <Button size="small" color="primary" type="submit">Save</Button>
              <Button size="small" onClick={() => history.goBack()}>Cancel</Button>
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
)(Cliente);