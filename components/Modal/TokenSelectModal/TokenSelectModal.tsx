import Modal from 'components/Modal';
import SearchInput from 'components/SearchInput';
import TokenView from 'components/TokenView';
import { Addresses, VETH_ADDRESS } from 'contracts/addresses';
import useMoralis from 'hooks/useMoralis';
import { useWallet } from 'hooks/useWallet';
import { IToken } from 'interfaces/swap';
import React, { useEffect, useMemo, useState } from 'react';
import { useLazyGetTokenPricesQuery } from 'services/api/price';
import { selectCurrentUsdPrice } from 'services/selectors/price';
import balanceTool from 'utils/balance';
import { isSameContract, parseDexString, parseIntString } from 'utils/string';

import style from './TokenSelectModal.module.scss';

interface TokenSelectModalProps {
  show?: boolean;
  tokens: IToken[];
  onBack: () => void;
  onSelectToken: (token: IToken) => void;
  onAddFundBot?: () => void;
  showMyToken?: boolean;
}

const TokenSelectModal = ({
  show = false,
  onBack,
  tokens,
  onSelectToken,
  onAddFundBot,
  showMyToken = true,
}: TokenSelectModalProps) => {
  if (!show) return null;

  const { getNativeBalance, getMyTokens } = useMoralis();
  const { wallet } = useWallet();
  const [fetchTokenPrice] = useLazyGetTokenPricesQuery();

  const [search, setSearch] = useState('');
  const [tokensList, setTokensList] = useState(tokens);
  const [tokenLoading, setTokenLoading] = useState<boolean>(true);

  const [availableToken, setAvailableToken] = useState<IToken[]>([]);

  const usdAmount = async (tokenAddress: string, balance: string, decimals: number) => {
    const priceData = await fetchTokenPrice({
      network: parseIntString(wallet.network),
      token:
        wallet.network &&
        (isSameContract(tokenAddress) ? Addresses[parseIntString(wallet.network)].weth : tokenAddress),
    }).unwrap();
    return balanceTool.convertToDollar(
      balanceTool.convertFromWei(balance, 4, decimals),
      selectCurrentUsdPrice(priceData),
    );
  };

  const fetchTokensList = async () => {
    if (showMyToken) {
      let myTokenList = await getMyTokens(wallet.account, parseDexString(wallet.network || '0x1'));
      // moralis api call one more time if result is empty while updating the api
      if (myTokenList.length === 0) {
        myTokenList = await getMyTokens(wallet.account, parseDexString(wallet.network || '0x1'));
      }

      let resultTokens = [];
      // Check ETH balance
      const ethBalance: string = await getNativeBalance(wallet.account, parseDexString(wallet.network || '0x1'));

      if (ethBalance !== '0') {
        let ethToken = tokensList.find((token) => isSameContract(token.address));
        ethToken.balance = ethBalance;
        ethToken.usdAmount = await usdAmount(VETH_ADDRESS, ethBalance, ethToken.decimals);
        resultTokens.push(ethToken);
      }

      await Promise.all(
        myTokenList.map(async (myToken) => {
          let result = tokensList.find((token) => isSameContract(token.address, myToken.token_address));
          if (result) {
            result.balance = myToken.balance;
            result.usdAmount = await usdAmount(myToken.token_address, myToken.balance, myToken.decimals);
            resultTokens.push(result);
          }
        }),
      );

      resultTokens = resultTokens.sort(function (a, b) {
        const first = Number(a?.usdAmount);
        const second = Number(b?.usdAmount);

        if (!first) return 1;
        if (!second) return -1;
        return first > second ? -1 : first < second ? 1 : 0;
      });
      setAvailableToken([...resultTokens]);
    } else {
      setAvailableToken([...tokensList]);
    }
    setTokenLoading(false);
  };

  useEffect(() => {
    if (tokens.length > 0) {
      setTokensList(tokens);
    }
  }, [tokens.length, showMyToken]);

  useEffect(() => {
    if (tokensList.length > 0 && wallet) {
      setTokenLoading(true);
      const delayDebounceFn = setTimeout(() => {
        const fetchData = async () => {
          await fetchTokensList();
        };
        fetchData();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [tokensList, wallet]);

  const selectableTokens = useMemo((): IToken[] => {
    if (!availableToken) return [];

    const result = availableToken.filter(
      (token) =>
        token.symbol.toLowerCase().includes(search.toLowerCase()) ||
        token.displayName.toLowerCase().includes(search.toLowerCase()),
    );
    return result;
  }, [availableToken, search]);

  return (
    <Modal title="Select token" onClose={onBack} className={style.container}>
      <SearchInput
        value={search}
        onChange={(value) => setSearch(value)}
        placeholder="Search token"
        className={style.search}
      />

      {tokenLoading && (
        <section>
          {/* <img
            className={style.loadingImage}
            src="/assets/images/Pigeon_loading.svg"
            width={94}
            height={100}
          /> */}
          <p className={style.text}>Searching Tokens...</p>
        </section>
      )}
      {/*
      {onAddFundBot && !tokenLoading && (
        <TokenView
          className={style.addFundBot}
          token={{
            address: '',
            displayName: 'Fund My Bot',
            symbol: 'Purchase Tokens',
            icon: '/assets/images/purchase.svg',
          }}
          key="add-funds-to-your-bot"
          onClick={(val) => onAddFundBot()}
        />
      )} */}

      {!tokenLoading && selectableTokens.length > 0 && (
        <section className={style.tokenList}>
          {selectableTokens.map((token) => (
            <TokenView token={token} key={`${token.symbol}-${token.address}`} onClick={(val) => onSelectToken(val)} />
          ))}
        </section>
      )}

      {!tokenLoading && availableToken.length > 0 && selectableTokens.length === 0 && (
        <section className={style.tokenEmpty}>
          <p className={style.tokenEmptyText}>
            We couldn't find tokens with this name. <br></br>Please try search again.
          </p>
        </section>
      )}

      {!tokenLoading && availableToken.length === 0 && (
        <section className={style.tokenEmpty}>
          {/* <img src={'/assets/images/Pigeon_dead.svg'} alt="pigeon_dead" width={116} height={105} /> */}
          <p className={style.text}>
            No Tokens found.<br></br>Connect another Wallet.
          </p>
        </section>
      )}
    </Modal>
  );
};

export default TokenSelectModal;
