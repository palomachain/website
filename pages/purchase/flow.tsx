import BigNumber from 'bignumber.js';
import CheckBox from 'components/CheckBox';
import PendingTransactionModal from 'components/Modal/PendingTransactionModal';
import SuccessModal from 'components/Modal/SuccessModal';
import { allChains } from 'configs/chains';
import { DEADLINE, SLIPPAGE_PERCENTAGE } from 'configs/constants';
import { getTxHashLink } from 'configs/links';
import SelectChain from 'containers/SelectChain';
import TokenSelector from 'containers/TokenSelector';
import { Addresses, VETH_ADDRESS } from 'contracts/addresses';
import useNodeSale from 'hooks/useNodeSale';
import useProvider from 'hooks/useProvider';
import useUniswap from 'hooks/useUniswap';
import { useWallet } from 'hooks/useWallet';
import { IPriceTiers } from 'interfaces/nodeSale';
import { IBalance, IToken } from 'interfaces/swap';
import React, { useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import ReactSlider from 'react-slider';
import { toast } from 'react-toastify';
import {
  useLazyGetNodeSalePriceQuery,
  useLazyGetPriceTiersQuery,
  useLazyGetTotalPurchasedQuery,
} from 'services/api/nodesale';
import { useLazyGetTokenPricesQuery } from 'services/api/price';
import { useGetUniswapTokenListQuery } from 'services/api/tokens';
import { selectCurrentUsdPrice } from 'services/selectors/price';
import { selectListedSwapTokensByChainId } from 'services/selectors/tokens';
import balanceTool from 'utils/balance';
import { NodeSaleEndDate, TotalNodes } from 'utils/constants';
import { CustomerSupport } from 'utils/data';
import mockTool from 'utils/mock';
import { abbreviateNumberSI, formatNumber } from 'utils/number';
import { parseIntString, stringToHex } from 'utils/string';
import PurchaseButton from './PurchaseButton';
import TotalPay from './TotalPay';

const supportedNetworks = {
  '1': 'Ethereum',
  '10': 'Optimism',
  '56': 'BNB',
  '137': 'Polygon',
  '8453': 'Base',
  '42161': 'Arbitrum',
};
const supportedChainIds = ['1', '10', '56', '137', '8453', '42161'];

const PurchaseFlow = () => {
  const { wallet } = useWallet();
  const provider = useProvider(wallet);
  const walletNetwork = wallet?.network ? Number(parseIntString(wallet.network)) : 1;

  const [selectedChain, setSelectedChain] = useState<string>();

  const [fetchTokenPrice] = useLazyGetTokenPricesQuery();
  const [fetchTotalPurchased] = useLazyGetTotalPurchasedQuery();
  const [fetchNodePrice] = useLazyGetNodeSalePriceQuery();
  const [fetchPriceTiers] = useLazyGetPriceTiersQuery();

  const { getProcessingFeeAmount, getSubscriptionFeeAmount, getSlippageFeePercent, buyNow } = useNodeSale({
    provider,
    wallet,
  });
  const { getSwapPath, getQuoteAmount, getSwapPathForV3 } = useUniswap({
    provider,
    wallet,
  });

  const [endDate, setEndDate] = useState(NodeSaleEndDate); // Set the End date of node sale
  const [totalPurchased, setTotalPurchased] = useState(0); // Set Saled Nodes Count
  const [priceTiers, setPriceTiers] = useState<IPriceTiers[]>();
  const [promoCode, setPromoCode] = useState<string>();
  const [appliedPromoCode, setApplyPromoCode] = useState<string>();
  const [selectedSupport, setSupport] = useState<number>(CustomerSupport.length - 1);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [agreeTermsOfUse, setAgreeTermsOfUse] = useState<boolean>(false);
  const [agreePolicy, setAgreePolicy] = useState<boolean>(false);
  const [agreeAck, setAgreeAck] = useState<boolean>(false);

  const [step, setStep] = useState(1);
  const [fetchingPriceLoading, setFetchingPriceLoading] = useState<boolean>(false);
  const [isTxLoading, setTxLoading] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState('');
  const [pendingModalTitle, setPendingModalTitle] = useState('');
  const [pendingModalText, setPendingModalText] = useState('');
  const [pendingModalProcess, setPendingModalProcess] = useState(false);

  const [fromToken, setFromToken] = useState(mockTool.getEmptyToken());
  const [fromTokenExchangeRate, setFromTokenExchangeRate] = useState(new BigNumber(0));
  const [swapPath, setSwapPath] = useState<string>(null);
  const [expectedAmount, setExpectedAmount] = useState<IBalance>(mockTool.emptyTokenBalance());

  const [nodePrice, setNodePrice] = useState<number>(0);
  const [processingFee, setProcessingFee] = useState<number>(5);
  const [subscriptionFee, setSubscriptionFee] = useState<number>(50);
  const [slippageFeePc, setSlippageFeePc] = useState<number>(1);

  const { selectedChainId, targetChain } = useMemo(() => {
    const targetChain = wallet.network ? allChains[parseIntString(wallet.network)] : mockTool.getMockChain();
    const selectedChainId = targetChain?.chainId;

    return {
      selectedChainId,
      targetChain,
    };
  }, [wallet]);

  const totalSupportPrice = useMemo(() => {
    const subFee = CustomerSupport[selectedSupport].price > 0 ? subscriptionFee : 0;
    return subFee * CustomerSupport[selectedSupport].month;
  }, [selectedSupport, subscriptionFee]);

  const totalPay = useMemo(() => {
    return nodePrice + processingFee + totalSupportPrice;
  }, [nodePrice, totalSupportPrice, processingFee]);

  const quantity = useMemo(() => {
    return priceTiers && priceTiers.length > 0 ? priceTiers.reduce((acc, curr) => acc + curr.inputAmount, 0) : 0;
  }, [priceTiers]);

  useEffect(() => {
    if (totalPay && slippageFeePc && fromToken && fromToken.address !== '' && fromTokenExchangeRate) {
      const expectedAmount = totalPay + (nodePrice * slippageFeePc) / 100;
      const tokenAmount = BigNumber(expectedAmount).dividedBy(fromTokenExchangeRate);
      const amount = {
        raw: balanceTool.convertToWei(tokenAmount.toString(), fromToken.decimals),
        format: tokenAmount.toString(),
      };

      setExpectedAmount(amount);
    }
  }, [totalPay, slippageFeePc, fromToken, fromTokenExchangeRate]);

  useEffect(() => {
    if (isValidTokenAmount) {
      const delayDebounceFn = setTimeout(async () => {
        await getNodePrice(quantity, appliedPromoCode);
      }, 2000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [quantity]);

  useEffect(() => {
    if (wallet && selectedChainId) {
      const delayDebounceFn = async () => {
        const price = await getProcessingFeeAmount();
        setProcessingFee(price);

        const sub_price = await getSubscriptionFeeAmount();
        setSubscriptionFee(sub_price);

        const slippage_fee_percent = await getSlippageFeePercent();
        setSlippageFeePc(slippage_fee_percent);
      };

      delayDebounceFn();
    }
  }, [wallet, selectedChainId]);

  useEffect(() => {
    const delayDebounceFn = async () => {
      const totalPurchasedCount = await fetchTotalPurchased({});
      let purchasedCount = Number(totalPurchasedCount?.data?.paid_node_cnt) ?? 0;
      const priceTiersCnt = await fetchPriceTiers({});
      if (priceTiersCnt.isSuccess) {
        let tempPriceTiers: IPriceTiers[] = [];
        priceTiersCnt?.data.map((tier, index) => {
          if (tier.quantity > purchasedCount) {
            tempPriceTiers.push({
              quantity: tier.quantity,
              price: tier.price,
              fdv: tier.fdv,
              purchased: purchasedCount,
              slot: index + 1,
              inputAmount: 0,
            });

            purchasedCount = 0;
          } else {
            purchasedCount -= tier.quantity;
          }
        });

        setPriceTiers([...tempPriceTiers]);
      }
    };

    delayDebounceFn();
  }, []);

  const getNodePrice = async (amount: number, promo_code?: string) => {
    const decodeData = stringToHex(promo_code);
    const price = await fetchNodePrice({ amount, promo_code: decodeData });

    if (price.isSuccess) {
      if (Number(price.data['price']) !== 0) {
        setNodePrice(Number(BigNumber(price.data['price']).dividedBy(1000000)));
        if (promo_code) {
          setApplyPromoCode(promo_code);
          toast.success('Congratulations! Your Promo Code has been verified.');
        }
      } else {
        promo_code && setApplyPromoCode(null);
        toast.error(promo_code ? 'Invalid Promo Code' : 'API async error. Please try again.');
      }
    } else {
      toast.error('API async error. Please try again.');
    }
  };

  const applyPromoCode = async (code: string) => {
    await getNodePrice(quantity, code);
  };

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

  const setInputAmount = (index: number, newValue: number) => {
    let tempPriceTiers = priceTiers;
    if (
      tempPriceTiers[index].inputAmount + tempPriceTiers[index].purchased >= tempPriceTiers[index].quantity &&
      tempPriceTiers[index].inputAmount > newValue
    ) {
      tempPriceTiers[index].inputAmount = newValue;
      tempPriceTiers.forEach((tier, key) => {
        if (key > index && tier.inputAmount > 0) {
          tempPriceTiers[key].inputAmount = 0;
        }
      });
    } else {
      let remainValue = newValue + tempPriceTiers[index].purchased - tempPriceTiers[index].quantity;
      if (remainValue > 0) {
        tempPriceTiers[index].inputAmount = tempPriceTiers[index].quantity - tempPriceTiers[index].purchased;
        for (let key = index + 1; remainValue > 0 && key <= tempPriceTiers.length - 1; key++) {
          tempPriceTiers[key].inputAmount =
            remainValue > tempPriceTiers[key].quantity ? tempPriceTiers[key].quantity : remainValue;
          remainValue -= tempPriceTiers[key].quantity;
        }
      } else {
        tempPriceTiers[index].inputAmount = newValue;
      }
    }

    setPriceTiers([...tempPriceTiers]);
  };

  const handleInputAmount = (index: number, isPlus = false) => {
    const prevAmount = priceTiers[index].inputAmount;
    const newValue = isPlus ? prevAmount + 1 : prevAmount - 1;
    setInputAmount(index, newValue);
  };

  useEffect(() => {
    if (wallet.network) {
      const chainId = parseIntString(wallet.network);
      if (chainId in supportedNetworks) setSelectedChain(chainId);
      else setSelectedChain('');
    } else setSelectedChain('');
  }, [wallet.network]);

  // Handler when fromToken selected
  useEffect(() => {
    const fetchBalance = async () => {
      if (fromToken.address === '') return;
      if (!provider || !wallet || !wallet.network) return;
      if (walletNetwork.toString() !== targetChain?.chainId.toString()) return;

      // Get fromToken Price in USD
      const priceData = await fetchTokenPrice({
        network: targetChain.chainId,
        token: fromToken.address === VETH_ADDRESS ? Addresses[targetChain?.chainId].weth : fromToken.address,
      }).unwrap();
      setFromTokenExchangeRate(selectCurrentUsdPrice(priceData));
    };

    fetchBalance();
  }, [fromToken, provider, wallet]);

  // Handle FromToken Amount (inputAmount) Changed
  useEffect(() => {
    const changeAmount = async () => {
      if (fromToken.address === '') return;
      if (!provider || !wallet || !wallet.network) return;
      if (wallet.network.toString() !== targetChain.chainId.toString()) return;
      if (expectedAmount.raw.comparedTo(0) <= 0) return;

      setFetchingPriceLoading(true);

      // toToken is USDC
      const toToken: IToken = {
        address: Addresses[selectedChainId].usdc,
        symbol: 'USDC',
        displayName: 'USDC',
        icon: 'https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
        decimals: 6,
      };

      const uniswapPath = await getSwapPath(
        fromToken,
        toToken,
        expectedAmount,
        SLIPPAGE_PERCENTAGE,
        DEADLINE,
        parseIntString(wallet.network),
        false,
        true,
      );

      const quoteAmount = getQuoteAmount(uniswapPath);
      const swapPathForV3 = getSwapPathForV3(uniswapPath, toToken);

      if (quoteAmount !== null) {
        setSwapPath(swapPathForV3);
      }
      setFetchingPriceLoading(false);
    };

    changeAmount();
  }, [provider, wallet, fromToken, expectedAmount]);

  const isValidTokenAmount = useMemo(() => {
    return quantity > 0 && quantity <= TotalNodes - totalPurchased;
  }, [quantity]);

  const isAllAgree = useMemo(() => {
    return agreeTerms && agreeTermsOfUse && agreeAck;
  }, [agreeTerms, agreeTermsOfUse, agreeAck]);

  const { listedTokens } = useGetUniswapTokenListQuery(
    {},
    {
      selectFromResult: (result) => ({
        listedTokens: selectListedSwapTokensByChainId(result.data, selectedChainId),
      }),
    },
  );

  // SwapSuccess handler
  const callbackSuccess = async ({ hash }) => {
    setTxLoading(false);
    setPendingTxHash('');
    setSuccessModal(true);
  };

  const callbackWaiting = ({ txHash, txTitle, txText, txProcessing = false }) => {
    // OnWait handler
    if (txTitle !== undefined) setPendingModalTitle(txTitle);
    if (txText !== undefined) setPendingModalText(txText);
    if (txHash !== undefined) setPendingTxHash(txHash);
    setPendingModalProcess(txProcessing);
  };

  const callbackError = (e) => {
    toast.error(e ? e : 'Something went wrong');
    setTxLoading(false);
  };

  const handleStart = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        if (!isTxLoading) {
          setTxLoading(true);

          await buyNow(
            fromToken,
            quantity,
            expectedAmount,
            (nodePrice * 1000000).toFixed(0),
            CustomerSupport[selectedSupport].price > 0,
            CustomerSupport[selectedSupport].month,
            swapPath,
            callbackSuccess,
            callbackError,
            callbackWaiting,
            stringToHex(appliedPromoCode),
          );
        }
      } catch (e) {
        console.log(e);
        setTxLoading(false);
      }
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
          </div>
          {priceTiers && priceTiers.length > 0 ? (
            priceTiers.map(
              (tier, index) =>
                (index > 0
                  ? priceTiers[index - 1].quantity <=
                    priceTiers[index - 1].purchased + priceTiers[index - 1].inputAmount
                  : true) && (
                  <div key={index}>
                    <div className="purchase-subscription">
                      <p>Slot {tier.slot} Remaining Nodes</p>
                      <ReactSlider
                        className="horizontal-slider"
                        thumbClassName="example-thumb"
                        trackClassName="example-track"
                        min={0}
                        max={tier.quantity}
                        value={tier.quantity - tier.purchased}
                        disabled
                      />
                      <p>
                        {tier.quantity - tier.purchased}/{tier.quantity}
                      </p>
                    </div>
                    <div className="purchase-sale-set" style={{ marginTop: '15px' }}>
                      <div className="purchase-sale-set__price purchase-sale-set__flex">
                        <p>
                          Price per Node <span>(Slot {tier.slot})</span>
                        </p>
                        <div className="purchase-sale-set__price__value flex-row">
                          <h2>{Number(tier.price) / 10 ** 6} USD</h2>
                          <p>Implied FDV ${abbreviateNumberSI(tier.fdv, 2, 2)}</p>
                        </div>
                      </div>
                      <div className="purchase-sale-set__quantity purchase-sale-set__flex">
                        <p>Node Quantity</p>
                        <div className="purchase-sale-set__quantity__value">
                          <button
                            className={`increase ${tier.inputAmount <= 0 ? 'not-allowed' : 'pointer'}`}
                            onClick={() => handleInputAmount(index)}
                            disabled={tier.inputAmount <= 0}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="quantity_value"
                            value={tier.inputAmount}
                            onChange={(e) => setInputAmount(index, Number(e.target.value))}
                            min={0}
                            // max={tier.quantity - tier.purchased}
                          />
                          <button
                            className={`increase ${
                              tier.quantity <= tier.purchased + tier.inputAmount ? 'not-allowed' : 'pointer'
                            }`}
                            onClick={() => handleInputAmount(index, true)}
                            disabled={tier.quantity <= tier.purchased + tier.inputAmount}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
            )
          ) : (
            <img src="/assets/icons/loading_circle.svg" width={24} alt="loading" style={{ margin: 'auto' }} />
          )}

          <div className="purchase-sale-set purchase-sale-promo">
            <div className="purchase-sale-set__price purchase-sale-set__flex">
              <p>
                Add Promo Code <span>(Optional)</span>
              </p>
              <div className="purchase-sale-set__price__value purchase-sale-promo__input flex-row">
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="purchase-promo" />
                <div className="purchase-promo-apply pointer" onClick={() => applyPromoCode(promoCode)}>
                  Apply
                </div>
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
                          ${subscriptionFee} USD
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
                      {support.price > 0 && (
                        <span className="purchase-sale-pay__supports-effects__sub">
                          * Requires a 24-month subscription. Total cost: $
                          {formatNumber(support.price > 0 ? subscriptionFee * support.month : 0, 0, 0)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="purchase-sale-set__back" onClick={() => setStep(1)}>
            <img src="/assets/icons/back.svg" alt="back" />
            <p>Paloma LightNode Subscription Sale</p>
          </div>
          <div className="purchase-sale-set__select">
            <SelectChain
              selectedChain={selectedChain}
              supportChains={supportedNetworks}
              setSelectedChain={setSelectedChain}
            />
            <TokenSelector
              label="Purchasing Token"
              supportedNetworks={supportedNetworks}
              token={fromToken}
              listedTokens={listedTokens}
              onSelectToken={(token) => setFromToken({ ...token })}
              canAddFund
            />
          </div>
        </>
      )}
      <div className="purchase-sale-set purchase-sale-promo">
        <div className="purchase-sale-set__price purchase-sale-set__flex">
          <p>You Pay</p>
          <div className="purchase-sale-pay">
            {priceTiers &&
              priceTiers.length > 0 &&
              priceTiers.map(
                (tier, index) =>
                  tier.inputAmount > 0 && (
                    <TotalPay
                      key={index}
                      title={`${tier.inputAmount}x LightNode Slot ${tier.slot}`}
                      step={step}
                      price={(Number(tier.price) * tier.inputAmount) / 10 ** 6}
                      exchangeRate={fromTokenExchangeRate}
                      fromToken={fromToken}
                    />
                  ),
              )}
            <TotalPay
              title="Purchase Processing Fee"
              step={step}
              price={processingFee}
              exchangeRate={fromTokenExchangeRate}
              fromToken={fromToken}
            />
            {totalSupportPrice > 0 && (
              <TotalPay
                title="Enhanced Customer Support"
                step={step}
                price={totalSupportPrice}
                exchangeRate={fromTokenExchangeRate}
                fromToken={fromToken}
              />
            )}
            <TotalPay
              title="Total"
              step={step}
              price={totalPay}
              exchangeRate={fromTokenExchangeRate}
              fromToken={fromToken}
            />
          </div>
        </div>
      </div>
      {step === 1 ? (
        <>
          <CheckBox
            label={
              <>
                I agree with the{' '}
                <a
                  href="https://docs.google.com/document/d/1puUO41mEjnj6qQqFpSyjzXIJanfG16KoXEZ8xBoB-VI/edit"
                  target="_blank"
                >
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
                I agree with the{' '}
                <a
                  href="https://docs.google.com/document/d/1xt-CNyditQZXZLcfwM_wsPMpiBL5TUiFQu7Alnw5VeY/edit"
                  target="_blank"
                >
                  Paloma LightNode Sale Terms of Use.
                </a>
              </>
            }
            checked={agreeTermsOfUse}
            onChange={() => setAgreeTermsOfUse(!agreeTermsOfUse)}
          />
          <CheckBox
            label={
              <>
                I agree with the{' '}
                <a
                  href="https://docs.google.com/document/d/1wohVWiIEvsrswkV3KbOoxmOmc0fwnE6Wsk_JIqQrKrE/edit?usp=sharing"
                  target="_blank"
                >
                  Paloma LightNode Privacy Policy.
                </a>
              </>
            }
            checked={agreePolicy}
            onChange={() => setAgreePolicy(!agreePolicy)}
          />
          <CheckBox
            label="I acknowledge that all sales are final and non-refundable."
            checked={agreeAck}
            onChange={() => setAgreeAck(!agreeAck)}
          />
        </>
      ) : (
        <p>All purchases include a 1% slippage fee for swaps.</p>
      )}

      <PurchaseButton
        chainId={wallet ? parseIntString(wallet.network) : null}
        supportChains={supportedChainIds}
        full
        onClickStart={() => handleStart()}
        isValidTokenAmount={isValidTokenAmount}
        isTxLoading={isTxLoading}
        isFetchingPriceLoading={fetchingPriceLoading}
        isAllAgree={isAllAgree}
        support={selectedSupport}
        promoCode={promoCode}
        step={step}
        fromToken={fromToken}
        fromTokenExchangeRate={fromTokenExchangeRate}
        totalSupportPrice={totalSupportPrice}
        expectedAmount={expectedAmount} // token amount
        swapPath={swapPath}
        priceTiers={priceTiers}
        buttonText="Buy Now"
      />
      <PendingTransactionModal
        show={isTxLoading}
        onClose={() => setTxLoading(false)}
        title={pendingModalTitle}
        text={pendingModalText}
        txHash={pendingTxHash}
        isProcessing={pendingModalProcess}
        blockExplorer={getTxHashLink(targetChain?.chainId)}
      />

      <SuccessModal show={successModal} onClose={() => setSuccessModal(false)} />
    </div>
  );
};

export default PurchaseFlow;
