import { useState } from "react";
import Countdown from "react-countdown";
import { NodeSaleStartDate, TotalNodes } from "utils/constants";

const PurchaseFlow = () => {
  const [endDate, setEndDate] = useState(NodeSaleStartDate); // Set the End date of node sale
  const [saledNodes, setSaledNodes] = useState(102); // Set Saled Nodes Count
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState<string>();

  const CompleteTime = () => <span>Sale ended</span>;
  // Table style
  const rendererTime = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <CompleteTime />;
    } else {
      // Render a countdown
      return (
        <>
          <span>Sale ends in</span>
          <p>
            {days} days {hours} hrs {minutes} min
          </p>
        </>
      );
    }
  };

  const setQuantityValue = (isPlus = false) => {
    setQuantity(isPlus ? quantity + 1 : quantity - 1);
  };

  return (
    <div className="purchase-flow">
      <div className="purchase-sale-end">
        <Countdown date={endDate} renderer={rendererTime} />
      </div>
      <div className="purchase-subscription">
        <h3>Paloma LightNode Subscription Sale</h3>
        <p>Slot 1 Remaining Nodes</p>
        <input type="range" min={1} max={TotalNodes} value={saledNodes} className="purchase-subscription__range"/>
        <p>
          {saledNodes}/{TotalNodes}
        </p>
      </div>
      <div className="purchase-sale-set">
        <div className="purchase-sale-set__price purchase-sale-set__flex">
          <p>
            Price per Node <span>(Slot 1)</span>
          </p>
          <div className="purchase-sale-set__price__value flex-row">
            <h2>50 USD</h2>
            <p>Implied FDV $5MM</p>
          </div>
        </div>
        <div className="purchase-sale-set__quantity purchase-sale-set__flex">
          <p>Node Quantity</p>
          <div className="purchase-sale-set__quantity__value">
            <button
              className={`increase ${quantity <= 1 ? "not-allowed" : "pointer"}`}
              onClick={() => setQuantityValue()}
              disabled={quantity <= 1}
            >
              -
            </button>
            <div className="plus">{quantity}</div>
            <button
              className={`increase ${
                quantity >= TotalNodes - saledNodes ? "not-allowed" : "pointer"
              }`}
              onClick={() => setQuantityValue(true)}
              disabled={quantity >= TotalNodes - saledNodes}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="purchase-sale-set purchase-sale-promo">
        <div className="purchase-sale-set__price purchase-sale-set__flex">
          <p>
            Add Promo Code <span>(Optional)</span>
          </p>
          <div className="purchase-sale-set__price__value purchase-sale-promo__input flex-row">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="purchase-promo"
            />
            <div className="purchase-promo-apply">Apply</div>
          </div>
        </div>
      </div>
      <div className="purchase-sale-set purchase-sale-promo">
        <div className="purchase-sale-set__price purchase-sale-set__flex">
          <p>You Pay</p>
          <div className="purchase-sale-pay">
            <div className="purchase-sale-pay__item flex-row">
              <p>1x LightNode Slot 1</p>
              <p className="pay-value">50 USD</p>
            </div>
            <div className="purchase-sale-pay__item flex-row">
              <p>Purchase Processing Fee</p>
              <p className="pay-value">5 USD</p>
            </div>
            <div className="purchase-sale-pay__item flex-row">
              <p className="pay-total">Total</p>
              <p className="pay-total-value">55 USD</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-row purchase-sale-agree">
        <input type="checkbox" />
        <p>
          I agree with the <a>Paloma LightNode Sale Terms and Conditions.</a>
        </p>
      </div>
      <div className="flex-row purchase-sale-agree">
        <input type="checkbox" />
        <p>I acknowledge that all sales are final and non-refundable.</p>
      </div>
    </div>
  );
};

export default PurchaseFlow;
