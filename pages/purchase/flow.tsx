import CheckBox from "components/CheckBox";
import { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { NodeSaleStartDate, TotalNodes } from "utils/constants";
import { CustomerSupport } from "utils/data";
import { formatNumber } from "utils/number";
import PurchaseButton from "./PurchaseButton";
import { useWallet } from "hooks/useWallet";
import useProvider from "hooks/useProvider";
import { parseIntString } from "utils/string";
import { supportedNetworks } from "configs/networks";
import SelectChain from "containers/SelectChain";
import TokenSelector from "containers/TokenSelector";

const PurchaseFlow = () => {
  const { wallet, requestAddNetwork, requestSwitchNetwork, openConnectionModal } = useWallet();
  const provider = useProvider(wallet);

  const [endDate, setEndDate] = useState(NodeSaleStartDate); // Set the End date of node sale
  const [saledNodes, setSaledNodes] = useState(102); // Set Saled Nodes Count
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState<string>();
  const [selectedSupport, setSupport] = useState<number>(CustomerSupport.length - 1);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [agreeTermsOfUse, setAgreeTermsOfUse] = useState<boolean>(false);
  const [agreeAck, setAgreeAck] = useState<boolean>(false);

  const [selectedChain, setSelectedChain] = useState<string>();

  const [step, setStep] = useState(1);
  const [fetchingPriceLoading, setFetchingLoading] = useState<boolean>(false);
  const [isTxLoading, setTxLoading] = useState<boolean>(false);

  const totalSupportPrice = useMemo(() => {
    return CustomerSupport[selectedSupport].price * CustomerSupport[selectedSupport].month;
  }, [selectedSupport]);

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

  useEffect(() => {
    if (wallet.network) {
      const chainId = parseIntString(wallet.network);
      if (chainId in supportedNetworks) setSelectedChain(chainId);
      else setSelectedChain("");
    } else setSelectedChain("");
  }, [wallet.network]);

  const isValidTokenAmount = useMemo(() => {
    return quantity > 0 && quantity <= TotalNodes - saledNodes;
  }, [quantity]);

  const isAllAgree = useMemo(() => {
    return agreeTerms && agreeTermsOfUse && agreeAck;
  }, [agreeTerms, agreeTermsOfUse, agreeAck]);

  const handleStart = () => {
    if (step === 1) {
      setStep(2);
    } else {
    }
  };

  return (
    <div className="purchase-flow">
      <div className="purchase-sale-end">
        <Countdown date={endDate} renderer={rendererTime} />
      </div>
      {step === 1 ? (
        <>
          <div className="purchase-subscription">
            <h3>Paloma LightNode Subscription Sale</h3>
            <p>Slot 1 Remaining Nodes</p>
            <input
              type="range"
              min={1}
              max={TotalNodes}
              value={saledNodes}
              className="purchase-subscription__range"
              readOnly
            />
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
                <input
                  type="number"
                  className="quantity_value"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Number(e.target.value) > TotalNodes - saledNodes
                        ? TotalNodes - saledNodes
                        : Number(e.target.value)
                    )
                  }
                  min={1}
                  max={TotalNodes - saledNodes}
                />
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
              <p>Customer Support</p>
              <div className="purchase-sale-pay">
                {CustomerSupport.map((support, index) => (
                  <div key={index}>
                    <div className="purchase-sale-pay__supports">
                      <CheckBox
                        label={support.label}
                        checked={index === selectedSupport}
                        onChange={() => setSupport(index)}
                      />
                      {support.price > 0 ? (
                        <p>
                          ${support.price} USD
                          <br />
                          <span>per month</span>
                        </p>
                      ) : (
                        <p>Free</p>
                      )}
                    </div>
                    <div className="purchase-sale-pay__supports-effects">
                      {support.effects.map((effect, key) => (
                        <CheckBox disabled label={effect} key={key} />
                      ))}
                    </div>
                  </div>
                ))}
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
                {totalSupportPrice > 0 && (
                  <div className="purchase-sale-pay__item flex-row">
                    <p>Enhanced Customer Support</p>
                    <p className="pay-value">{formatNumber(totalSupportPrice, 0, 0)} USD</p>
                  </div>
                )}
                <div className="purchase-sale-pay__item flex-row">
                  <p className="pay-total">Total</p>
                  <p className="pay-total-value">
                    {formatNumber(50 + 5 + totalSupportPrice, 0, 0)} USD
                  </p>
                </div>
              </div>
            </div>
          </div>
          <CheckBox
            label={
              <>
                I agree with the{" "}
                <a href="" target="_blank">
                  Paloma LightNode Sale Terms and Conditions.
                </a>
              </>
            }
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
          />
          <CheckBox
            label={
              <>
                I agree with the{" "}
                <a href="" target="_blank">
                  Paloma LightNode Sale Terms of Use.
                </a>
              </>
            }
            checked={agreeTermsOfUse}
            onChange={() => setAgreeTermsOfUse(!agreeTermsOfUse)}
          />
          <CheckBox
            label="I acknowledge that all sales are final and non-refundable."
            checked={agreeAck}
            onChange={() => setAgreeAck(!agreeAck)}
          />
        </>
      ) : (
        <>
          <div className="cursor" onClick={() => setStep(1)}>
            <img src="/assets/icons/back.svg" alt="back" /> Paloma LightNode Subscription Sale
          </div>
          <div>
            <SelectChain
              selectedChain={selectedChain}
              supportChains={supportedNetworks}
              setSelectedChain={setSelectedChain}
            />
              <TokenSelector
                label="You sell"
                botType={BotTypes.CURVE_LIMIT_ORDER}
                token={fromToken}
                tokenBalance={fromTokenBalance}
                exchangeRate={fromTokenExchangeRate}
                amount={inputAmount}
                listedTokens={listedTokens}
                onInputAmount={handleInputAmount}
                onClickMaxTokenBalance={handleClickMaxFromToken}
                onSelectToken={(token) => setFromToken({ ...token })}
                canAddFund
              />
          </div>
        </>
      )}
      <PurchaseButton
        chainId={wallet ? wallet.network : null}
        botChain={selectedChain}
        full
        onClickStart={() => handleStart()}
        isValidTokenAmount={isValidTokenAmount}
        isAmountInputLoading={fetchingPriceLoading}
        isTxLoading={isTxLoading}
        isAllAgree={isAllAgree}
        support={selectedSupport}
        promoCode={promoCode}
        step={step}
        buttonText="Buy Now"
      />
    </div>
  );
};

export default PurchaseFlow;
