import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/components/AuthProvider';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Inicialização do Stripe
const stripePromise = loadStripe('pk_test_51Q7LB5RoP7xSyzInLYmF4olyILiyd1StuRFSOU0vGG8k2zMAXRbusC5C7y8A55M9IqaIE3TKm2D5v95k4FSirEQL006J69hPvZ');

// Inicialização do Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko';
const supabase = createClient(supabaseUrl, supabaseKey);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Criar um PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Enviar o PaymentMethod para o seu servidor
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Atualizar o status da assinatura no Supabase
      await supabase
        .from('users')
        .update({ subscription_status: 'active' })
        .eq('id', user.id);

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe || loading} className="mt-4">
        {loading ? 'Processando...' : 'Assinar'}
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default" className="mt-4">
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Sua assinatura foi criada com sucesso!</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

const AssinaturaStripe = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Assine o Plano Premium</CardTitle>
        <CardDescription>Acesse todos os recursos exclusivos</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </CardContent>
    </Card>
  );
};

export default AssinaturaStripe;