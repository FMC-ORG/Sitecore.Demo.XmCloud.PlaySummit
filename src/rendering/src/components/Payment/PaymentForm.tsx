import { ComponentProps } from 'lib/component-props';
import OrderSummary from './OrderSummary';
import PaymentAndBillingForm from './PaymentAndBillingForm';

const PaymentForm = (props: ComponentProps): React.JSX.Element => {
  const sxaStyles = `${props.params?.styles || ''}`;

  return (
    <div className={`payment-form ${sxaStyles}`}>
      <div className="payment-form-order-summary">
        <OrderSummary />
      </div>
      <div className="payment-form-payment">
        <PaymentAndBillingForm />
      </div>
    </div>
  );
};

export const Default = PaymentForm;
