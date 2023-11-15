// This is your test secret API key.
const stripe = require('stripe')('sk_test_51OCN4WGnL2SVEGFC0v9ws9EyTOhd6fpKkLxVqsAJs7EeWXshkzZslRIOAlGp7brV7zol6xBvBhCS0B1AbS9BQv1b00CM3ThKEI');
const express = require('express');
const bodyparser = require("body-parser");
const app = express();
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
        shipping_address_collection: {
        allowed_countries: ['US', 'EU'],
        },
            shipping_options: [
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 0,
                    currency: 'usd',
                },
                display_name: 'Free shipping',
                // Delivers between 5-7 business days
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 5,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 7,
                    },
                }
                }
            },
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 1500,
                    currency: 'usd',
                },
                display_name: 'Next day air',
                // Delivers in exactly 1 business day
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 1,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 1,
                    },
                }
                }
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));