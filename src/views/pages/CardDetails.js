import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, TextField, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import configData from '../../config';
import { useSelector } from 'react-redux';
const useStyles = makeStyles(() => ({
  root: {
    width: '500px',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '20px',
    paddingTop: '20px',
    height: '393px',
    marginRight: '10px',
    marginLeft: '10px',

  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '20',
    marginRight: '30'
  },
  button: {
    marginTop: '10px !important'
  },
}));

const CardDetails = ({ openModelFn, planForPay, certificateDetails, certificateSelected, planCost, currency, costToPass, frequencyPlan, showCerificate, certificateIdForCertification }) => {
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [cardHolderName, setcardHolderName] = useState('');
  const emailForPay = localStorage.getItem('emailForPayment');
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const account = useSelector((state) => state.account);
  useEffect(() => {
    setEmail(emailForPay)
  }, [])

  const handleSubmitPay = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    //certificate_id
    let header = {
      headers: { 'Authorization': "Bearer " + account.token }
    };
    const res = await axios.post(configData.API_SERVER + 'pay', {
      email: email,
      name: cardHolderName,
      duration: parseInt(frequencyPlan.split(" ")[0]),
      plan: planForPay,
      cost: costToPass,
      currency,
      certificate_id: certificateIdForCertification
    }, header);

    const clientSecret = res.data['client_secret'];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
          name: cardHolderName
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        openModelFn()
        navigate(`/admin/user-profile`);
        localStorage.setItem('isModelRequired', true)
        localStorage.setItem('isPremiumUser', true)
        //
      }
    }
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" align="left" gutterBottom className="textForCardPayment">
        Pay with Card
      </Typography>
      <form className={classes.form} onSubmit={handleSubmitPay}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              label="Email"
              variant="outlined"
              value={emailForPay}
              fullWidth
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
            // You can add state and onChange handler for the cardholder name
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Cardholder Name"
              variant="outlined"
              fullWidth
              onChange={(e) => setcardHolderName(e.target.value)}
            // You can add state and onChange handler for the cardholder name
            />
          </Grid>
          <Grid item xs={12}>
            <CardElement
              options={{ style: { base: { fontSize: '16px' } } }}
            />
          </Grid>
        </Grid>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleSubmitPay}
        >
          {loading ? 'Pay Now' : 'Pay Now'}
        </Button>
      </form>
    </Paper>
  );
};

export default CardDetails;
