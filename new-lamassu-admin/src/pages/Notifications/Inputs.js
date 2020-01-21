import React from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import * as Yup from 'yup'
import { Form, Formik, Field as FormikField } from 'formik'
import { makeStyles } from '@material-ui/core'

import {
  H4,
  Label1,
  Info1,
  TL2,
  Info2,
  Label2
} from 'src/components/typography'
import { ReactComponent as EditIcon } from 'src/styling/icons/action/edit/enabled.svg'
import { ReactComponent as DisabledEditIcon } from 'src/styling/icons/action/edit/disabled.svg'
import { Link } from 'src/components/buttons'
import TextInputFormik from 'src/components/inputs/formik/TextInput'

import {
  localStyles,
  inputSectionStyles,
  percentageAndNumericInputStyles,
  multiplePercentageInputStyles,
  fieldStyles
} from './Notifications.styles'

const fieldUseStyles = makeStyles(R.mergeAll([fieldStyles, localStyles]))

const Field = ({
  editing,
  field,
  displayValue,
  decoration,
  className,
  setError,
  ...props
}) => {
  const classes = fieldUseStyles()

  const classNames = {
    [className]: true,
    [classes.field]: true,
    [classes.notEditing]: !editing,
    [classes.percentageInput]: decoration === '%'
  }

  return (
    <div className={classnames(classNames)}>
      {field.label && <Label1 className={classes.label}>{field.label}</Label1>}
      <div className={classes.displayValue}>
        {!editing && props.large && (
          <>
            <Info1>{displayValue(field.value)}</Info1>
          </>
        )}
        {!editing && !props.large && (
          <>
            <Info2>{displayValue(field.value)}</Info2>
          </>
        )}
        {editing && (
          <FormikField
            id={field.name}
            name={field.name}
            component={TextInputFormik}
            placeholder={field.placeholder}
            type="text"
            onFocus={() => setError(null)}
            {...props}
          />
        )}
        {props.large && (
          <>
            <TL2>{decoration}</TL2>
          </>
        )}
        {!props.large && (
          <>
            <Label2>{decoration}</Label2>
          </>
        )}
      </div>
    </div>
  )
}

const useStyles = makeStyles(inputSectionStyles)

const Header = ({ title, editing, disabled, setEditing }) => {
  const classes = useStyles()

  return (
    <div className={classes.header}>
      <H4>{title}</H4>
      {!editing && !disabled && (
        <button onClick={() => setEditing(true)} className={classes.editButton}>
          <EditIcon />
        </button>
      )}
      {disabled && (
        <div className={classes.disabledButton}>
          <DisabledEditIcon />
        </div>
      )}
      {editing && (
        <div className={classes.editingButtons}>
          <Link color="primary" type="submit">
            Save
          </Link>
          <Link color="secondary" type="reset">
            Cancel
          </Link>
        </div>
      )}
    </div>
  )
}

const BigNumericInput = ({
  title,
  field,
  editing,
  disabled,
  setEditing,
  handleSubmit,
  setError,
  className
}) => {
  const classes = useStyles()

  const { name, value } = field

  return (
    <div className={className}>
      <Formik
        initialValues={{ [name]: value }}
        validationSchema={Yup.object().shape({
          [name]: Yup.number()
            .integer()
            .min(0)
            .max(99999)
            .required()
        })}
        onSubmit={values => {
          handleSubmit(values)
        }}
        onReset={(values, bag) => {
          setEditing(false)
          setError(null)
        }}>
        <Form>
          <Header
            title={title}
            editing={editing}
            disabled={disabled}
            setEditing={() => setEditing(true)}
          />
          <div className={classes.body}>
            <Field
              editing={editing}
              field={field}
              displayValue={x => (x === '' ? '-' : x)}
              decoration="EUR"
              large
              setError={setError}
            />
          </div>
        </Form>
      </Formik>
    </div>
  )
}

const percentageAndNumericInputUseStyles = makeStyles(
  R.merge(inputSectionStyles, percentageAndNumericInputStyles)
)

const BigPercentageAndNumericInput = ({
  title,
  fields,
  editing,
  disabled,
  setEditing,
  handleSubmit,
  setError,
  className
}) => {
  const classes = percentageAndNumericInputUseStyles()

  const { percentage, numeric } = fields
  const { name: percentageName, value: percentageValue } = percentage
  const { name: numericName, value: numericValue } = numeric

  return (
    <div className={className}>
      <Formik
        initialValues={{
          [percentageName]: percentageValue,
          [numericName]: numericValue
        }}
        validationSchema={Yup.object().shape({
          [percentageName]: Yup.number()
            .integer()
            .min(0)
            .max(100)
            .required(),
          [numericName]: Yup.number()
            .integer()
            .min(0)
            .max(99999)
            .required()
        })}
        onSubmit={values => {
          handleSubmit(values)
        }}
        onReset={(values, bag) => {
          setEditing(false)
          setError(null)
        }}>
        <Form>
          <Header
            title={title}
            editing={editing}
            disabled={disabled}
            setEditing={() => setEditing(true)}
          />
          <div className={classes.body}>
            <div className={classes.percentageDisplay}>
              <div style={{ height: `${percentageValue}%` }}></div>
            </div>
            <div className={classes.inputColumn}>
              <Field
                editing={editing}
                field={percentage}
                displayValue={x => (x === '' ? '-' : x)}
                decoration="%"
                large
                setError={setError}
              />
              <Field
                editing={editing}
                field={numeric}
                displayValue={x => (x === '' ? '-' : x)}
                decoration="EUR"
                large
                setError={setError}
              />
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

const multiplePercentageInputUseStyles = makeStyles(
  R.merge(inputSectionStyles, multiplePercentageInputStyles)
)

const MultiplePercentageInput = ({
  title,
  fields,
  editing,
  disabled,
  setEditing,
  handleSubmit,
  setError,
  className
}) => {
  const classes = multiplePercentageInputUseStyles()

  const initialValues = R.fromPairs(R.map(f => [f.name, f.value], fields))
  const validationSchemaShape = R.fromPairs(
    R.map(
      f => [
        f.name,
        Yup.number()
          .integer()
          .min(0)
          .max(100)
          .required()
      ],
      fields
    )
  )

  return (
    <div className={className}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape(validationSchemaShape)}
        onSubmit={values => {
          handleSubmit(values)
        }}
        onReset={(values, bag) => {
          setEditing(false)
          setError(null)
        }}>
        <Form>
          <Header
            title={title}
            editing={editing}
            disabled={disabled}
            setEditing={() => setEditing(true)}
          />
          <div className={classes.body}>
            {fields.map((field, idx) => (
              <div key={idx}>
                <div className={classes.percentageDisplay}>
                  <div style={{ height: `${field.value}%` }}></div>
                </div>
                <div className={classes.inputColumn}>
                  <TL2 className={classes.title}>{field.title}</TL2>
                  <Field
                    editing={editing}
                    field={field}
                    displayValue={x => (x === '' ? '-' : x)}
                    decoration="%"
                    className={classes.percentageInput}
                    large
                    setError={setError}
                  />
                </div>
              </div>
            ))}
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export {
  Field,
  BigNumericInput,
  BigPercentageAndNumericInput,
  MultiplePercentageInput
}