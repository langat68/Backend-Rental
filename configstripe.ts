import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51PbJAHG8WrtA7btLAZPWn7a0g2FyXVCe2LO8LS6zJPlU4u1Dfm1qwI6xXVvRQaJWNdfAsKoP3fLjFmHaNa0cu8Gx00jUIR9foI', {
  apiVersion: '2024-06-20',
});

export default stripe;
