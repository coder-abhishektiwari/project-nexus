import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RazorpayOptions {
  projectId: string;
  projectName: string;
  amount: number;
  onSuccess: (transaction: any) => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async ({
    projectId,
    projectName,
    amount,
    onSuccess,
    onError,
  }: RazorpayOptions) => {
    try {
      setLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please sign in to continue');
      }

      // STEP 1 — Create Razorpay Order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            projectId,
            amount
          }
        }
      );

      if (orderError) {
        throw orderError;
      }

      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single();

      // Step 2 — Razorpay Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Project Nexus',
        description: projectName,
        order_id: orderData.orderId,
        prefill: {
          name: profileData?.full_name || "",
          email: profileData?.email || session.user.email
        },
        theme: { color: '#3b82f6' },

        // STEP 3 — Payment handler
        handler: async (response: any) => {
          try {
            const { data: verifyData, error: verifyError } =
              await supabase.functions.invoke(
                'verify-razorpay-payment',
                {
                  body: {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    projectId,
                    amount,
                  },
                  headers: {
                    Authorization: `Bearer ${session.access_token}`
                  }
                }
              );

            if (verifyError) {
              throw verifyError;
            }

            toast({
              title: 'Payment Successful!',
              description: 'Your project is now available for download.',
            });

            onSuccess(verifyData.transaction);

          } catch (err: any) {
            toast({
              title: 'Verification Failed',
              description: err.message,
              variant: 'destructive',
            });
            onError?.(err);
          }
        }
      };

      // Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      console.error("Payment initiation failed:", err);

      toast({
        title: 'Payment Failed',
        description: err.message,
        variant: 'destructive',
      });

      onError?.(err);

    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
};
