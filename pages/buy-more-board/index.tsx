import Purchase from 'components/Button/purchase';
import { USER_ACCESS_TOKEN } from 'configs/constants';
import { StaticLink } from 'configs/links';
import useCookie from 'hooks/useCookie';
import { useWallet } from 'hooks/useWallet';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  useLazyGetBalancesQuery,
  useLazyGetLoginConfirmationQuery,
  useLazyGetPromocodeStatusQuery,
  useLazyGetStatusQuery,
} from 'services/api/nodesale';
import { checksumAddress } from 'viem';
import { hexToStringWithBech, shortenString } from 'utils/string';

import style from './buyMoreBoard.module.scss';
import classNames from 'classnames';
import { convertTime } from 'utils/date';
import { formatNumber } from 'utils/number';
import BigNumber from 'bignumber.js';
import balanceTool from 'utils/balance';
import GeneratePromocodeModal from 'components/Modal/GeneratePromocodeModal';
import useNodeSale from 'hooks/useNodeSale';
import useProvider from 'hooks/useProvider';
import { IBonusBalance } from 'interfaces/nodeSale';

// Matched with /status backend api
const chainID = {
  eth: 1,
  bnb: 56,
  arb: 42161,
  op: 10,
  base: 8453,
  matic: 137,
};

const BuyMoreBoard = () => {
  const { wallet } = useWallet();
  const provider = useProvider(wallet);
  const { getStoredData } = useCookie();
  const [getLoginConfirmation] = useLazyGetLoginConfirmationQuery();
  const [getPromocodeStatus] = useLazyGetPromocodeStatusQuery();
  const [getStatus] = useLazyGetStatusQuery();
  const [getBalances] = useLazyGetBalancesQuery();
  const { getBonusAmount } = useNodeSale({ wallet, provider });
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [token, setToken] = useState<string>();
  const [myAccount, setMyAccount] = useState({
    email: '',
    promo_code: '',
    status: 0, // 0: pending, 1: Active
    wallet_address: '',
  });
  const [totalRewards, setTotalRewards] = useState({
    rewards: '0',
    usd: '0',
  });
  const [myPurchaseStatus, setMyPurchaseStatus] = useState<any[]>();
  const [dataLoading, setDataLoading] = useState(false);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [myAccountLoading, setMyAccountLoading] = useState(false);
  const [bonusLoading, setBonusLoading] = useState(false);
  const [bonusAmount, setBonusAmount] = useState<IBonusBalance[]>();
  const [openGeneratePromocodeModal, setOpenGeneratePromocodeModal] = useState(false);
  const [copyPromocode, setCopyPromocode] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const myToken = await getStoredData(USER_ACCESS_TOKEN);
      if (myToken.data) {
        const confirmResult = await getLoginConfirmation({ token: myToken.data });
        if (confirmResult.isSuccess && confirmResult.data && confirmResult.data['token']) {
          setToken(confirmResult.data['token']);
          setPageLoading(false);
          return;
        }
      }

      router.push(`${StaticLink.LOGIN}/?redirect=${StaticLink.BUYMOREBOARD}`);
    };
    checkLogin();
  }, []);

  const fetchMyAccount = async () => {
    setMyAccountLoading(true);

    const promocode = await getPromocodeStatus({ token });
    if (promocode.isSuccess) {
      setBonusLoading(true);

      const info = promocode.data[0];
      setMyAccount({
        email: info['email'],
        promo_code: info['promo_code'],
        status: info['status'], // 0: pending, 1: Active
        wallet_address: info['wallet_address'],
      });
    }

    setMyAccountLoading(false);
  };

  useEffect(() => {
    if (!myAccountLoading) {
      if (myAccount.promo_code && myAccount.status === 1 && myAccount.wallet_address) {
        setBonusLoading(true);

        const getBalance = async () => {
          const balance = await getBonusAmount(myAccount.wallet_address);
          setBonusAmount(balance);
          setBonusLoading(false);
        };
        getBalance();
      } else {
        setBonusLoading(false);
      }
    }
  }, [myAccountLoading, myAccount]);

  useEffect(() => {
    if (token) {
      fetchMyAccount();
    }
  }, [token]);

  useEffect(() => {
    if (token && wallet && wallet.account) {
      const apiCall = async () => {
        setDataLoading(true);
        // TODO
        const status = await getStatus({ buyer: checksumAddress(wallet.account) });
        if (status.isSuccess) {
          setMyPurchaseStatus(status.data);
        }

        setDataLoading(false);
      };
      apiCall();
    }
  }, [wallet.account, token]);

  useEffect(() => {
    if (dataLoading) setRewardsLoading(true);

    let palomaAddresses = [];

    if (!dataLoading && myPurchaseStatus && myPurchaseStatus.length > 0) {
      myPurchaseStatus.map((purchase) => {
        const address = hexToStringWithBech(purchase['paloma_address']);
        const isAlreadyExist = palomaAddresses.find((pAddress) => pAddress === address);
        if (!isAlreadyExist) {
          palomaAddresses.push(address);
        }
      });

      const apiCall = async () => {
        if (palomaAddresses.length > 0) {
          const api = await getBalances({ addresses: palomaAddresses });
          if (api.isSuccess) {
            setTotalRewards({
              rewards: balanceTool.convertFromWei(api.data['total'], 2, 6),
              usd: balanceTool.convertFromWei(api.data['usd_total'], 2, 6),
            });
          }
        }

        setRewardsLoading(false);
      };
      apiCall();
    }

    if (myPurchaseStatus && myPurchaseStatus.length === 0) {
      setRewardsLoading(false);
    }
  }, [myPurchaseStatus, dataLoading]);

  const totalNodes = useMemo(() => {
    if (dataLoading) return '-';
    if (myPurchaseStatus && myPurchaseStatus.length > 0) {
      let sum = myPurchaseStatus.reduce(function (x, y) {
        return x + y['node_count'];
      }, 0);
      return sum;
    }
    return 0;
  }, [dataLoading, myPurchaseStatus]);

  const totalGrainBalance = useMemo(() => {
    if (dataLoading) return '-';
    if (myPurchaseStatus && myPurchaseStatus.length > 0) {
      let sum = myPurchaseStatus.reduce(function (x, y) {
        return new BigNumber(x).plus(BigNumber(y['grain_amount']));
      }, 0);
      return sum;
    }
    return new BigNumber(0);
  }, [dataLoading, myPurchaseStatus]);

  const totalGrainUSD = useMemo(() => {
    if (dataLoading) return '-';
    if (myPurchaseStatus && myPurchaseStatus.length > 0) {
      let sum = myPurchaseStatus.reduce(function (x, y) {
        return x + Number(balanceTool.convertFromWei(y['fund_usd_amount'], 0, 6));
      }, 0);
      return sum;
    }
    return new BigNumber(0);
  }, [dataLoading, myPurchaseStatus]);

  useEffect(() => {
    // if (myAccountLoading)
  }, [myPurchaseStatus, myAccountLoading]);

  console.log('myPurchaseStatus', myPurchaseStatus);
  console.log('myAccount', myAccount);

  const closeCode = async (generated = false) => {
    setOpenGeneratePromocodeModal(false);
    if (generated) {
      setBonusLoading(true);
      await fetchMyAccount();
    }
  };

  const totalBonus = useMemo(() => {
    if (!bonusLoading && bonusAmount && bonusAmount.length > 0) {
      const amount = bonusAmount.reduce((acc, quote) => acc + Number(quote.amount.format), 0);
      return amount;
    } else {
      return 0;
    }
  }, [bonusLoading, bonusAmount]);

  const onClickActive = (index: number) => {
    if (index === 0 || (index > 0 && myPurchaseStatus[index - 1]['status'] >= 2)) {
    }
  };

  const onClickCopyPromocode = (code: string) => {
    setCopyPromocode(true);
    navigator.clipboard.writeText(`https://www.palomachain.com/purchase/?code=${code}`);
  };

  useEffect(() => {
    if (copyPromocode) {
      const delayDebounceFn = setTimeout(() => {
        setCopyPromocode(false);
      }, 3000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [copyPromocode]);

  return (
    <div>
      {pageLoading ? (
        <img src="/assets/icons/confirm-email.svg" alt="confirm-email" className={style.loadingImg} />
      ) : (
        <div className={style.buyMoreBoard}>
          <div className={style.myBalances}>
            <div className={style.balanceCard}>
              {dataLoading ? (
                <img src="/assets/icons/loading_circle.svg" height="25px" style={{ marginTop: 5 }} />
              ) : (
                <>
                  <p>Your Balance</p>
                  <h3>{formatNumber(totalGrainBalance.toString(), 0, 2)} GRAIN</h3>
                  <p className={style.usdValue}>${formatNumber(totalGrainUSD, 0, 2)}</p>
                </>
              )}
            </div>
            <div className={style.balanceCard}>
              {dataLoading || rewardsLoading ? (
                <img src="/assets/icons/loading_circle.svg" height="25px" style={{ marginTop: 5 }} />
              ) : (
                <>
                  <p>Total Rewards</p>
                  <h3>{formatNumber(totalRewards.rewards, 0, 2)} GRAIN</h3>
                  <p className={style.usdValue}>${formatNumber(totalRewards.usd, 0, 2)}</p>
                </>
              )}
            </div>
            <div className={classNames(dataLoading || bonusLoading ? style.balanceCard : style.bonusCard)}>
              {dataLoading || bonusLoading ? (
                <img src="/assets/icons/loading_circle.svg" height="25px" style={{ marginTop: 5 }} />
              ) : myAccount.promo_code ? (
                myAccount.status === 1 ? (
                  <div className={style.bonusBalanceCard}>
                    <div className={style.referralBonus}>
                      Total Referral Bonus<span>{formatNumber(totalBonus, 0, 2)} USDC</span>
                    </div>
                    <div className={style.bonusBtns}>
                      <button>
                        Claim Bonus <img src="/assets/icons/arrow.svg" alt="arrow" />
                      </button>
                      <button onClick={() => onClickCopyPromocode(myAccount.promo_code)}>
                        <img src="/assets/icons/copy_graypink.png" alt="copy" />
                        {copyPromocode ? 'Copied Code!' : 'Copy Code'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={style.bonusPendingCard}>
                    <p>Your Referral Promo Code Status</p>
                    <h3>Pending....</h3>
                    <p className={style.bonusFooter}>Your request will be processed in a few minutes.</p>
                  </div>
                )
              ) : (
                <>
                  <img className={style.bonusBg1} src="/assets/icons/promocode_bg1.png" alt="promocode_bg1" />
                  <div className={style.bonusText}>
                    Don’t Miss Out!
                    <br />
                    Get Paid A Referral Bonus
                    <button className={style.createPromocode} onClick={() => setOpenGeneratePromocodeModal(true)}>
                      Create Promo Code
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={style.myHistoryTable}>
            <div className={style.tableHeader}>Your Paloma LightNodes</div>
            <table className={style.tableBody}>
              <thead>
                <tr className={style.tableRow}>
                  <th>
                    Paloma Address<span>Numer of Nodes</span>
                  </th>
                  <th>Date</th>
                  <th>EVM Adress</th>
                  <th>GRAINs Minted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dataLoading ? (
                  <tr>
                    <td>
                      <img src="/assets/icons/loading_circle.svg" height="42px" />
                    </td>
                  </tr>
                ) : myPurchaseStatus && myPurchaseStatus.length > 0 ? (
                  myPurchaseStatus.map((purchase, index) => (
                    <tr
                      className={classNames(style.tableTBody, index % 2 === 0 ? undefined : style.grayTableTBody)}
                      key={index}
                    >
                      <td>
                        {shortenString(hexToStringWithBech(purchase['paloma_address']), 9)}
                        <span>{formatNumber(purchase['node_count'], 0, 2)} LightNodes</span>
                      </td>
                      <td>{convertTime(purchase['created_at'].toString())}</td>
                      <td>{shortenString(purchase['buyer'], 6, 6)}</td>
                      <td>{formatNumber(purchase['grain_amount'], 0, 2)}</td>
                      <td className={style.activeButton}>
                        {+purchase['status'] < 2 ? (
                          <button onClick={() => onClickActive(index)}>Active</button>
                        ) : (
                          'Mining'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      <p className={style.noActiveText}>The wallet currently does not have any active LightNodes.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={style.tableFooter}>
              <p>Total: {totalNodes} LightNodes</p>
              <Purchase type="pink" text="+ Add a LightNode" />
            </div>
          </div>
        </div>
      )}
      {openGeneratePromocodeModal && <GeneratePromocodeModal onClose={(e) => closeCode(e)} token={token} />}
    </div>
  );
};

export default BuyMoreBoard;
