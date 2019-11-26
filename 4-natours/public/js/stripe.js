/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_JPrtvyDNpr6xvhrL4dXXnDFh00ovh6c4Mz');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from APIFeatures
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }

  // 2) Create checkout form + charge credit card
};
