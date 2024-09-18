import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import cn from 'classnames';
import ButtonSelector from './ButtonSelector';
import { allChains } from 'configs/chains';
import { WalletProfiles } from 'configs/constants';
import { enableImageLink } from 'configs/links';
import Divider from '../Divider';
import { parseIntString } from 'utils/string';

import style from 'components/ButtonSelector/WalletSelector.module.scss';

interface ButtonProps {
  wallet?: string | null;
  network?: string;
  openExplorer?: boolean;
  disconnectWallet: () => void;
  className?: string;
}

const WalletSelector = ({ wallet, network, openExplorer = true, disconnectWallet, className }: ButtonProps) => {
  const [hoveredText, setHoveredText] = useState<string>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    wallet && (
      <ButtonSelector className={cn(style.ButtonSelector, className)}>
        <div>
          <CopyToClipboard text={wallet} onCopy={() => setCopied(true)}>
            <div className={style.selectOption} onMouseOver={() => setHoveredText(WalletProfiles.CopyAddress)}>
              <img src={enableImageLink('copy', hoveredText === WalletProfiles.CopyAddress)} alt="" />
              <span
                className={cn(
                  hoveredText === WalletProfiles.CopyAddress ? style.pink : undefined,
                  style.selectNetwork,
                )}
              >
                {copied ? WalletProfiles.CopiedAddress : WalletProfiles.CopyAddress}
              </span>
            </div>
          </CopyToClipboard>
          {openExplorer && (
            <a
              href={`${allChains[parseIntString(network)].blockExplorerUrl}address/${wallet}`}
              target="_blank"
              className={style.selectOption}
              onMouseOver={() => setHoveredText(WalletProfiles.OpenExplorer)}
            >
              <img src={enableImageLink('explorer', hoveredText === WalletProfiles.OpenExplorer)} alt="" />
              <span
                className={cn(
                  hoveredText === WalletProfiles.OpenExplorer ? style.pink : undefined,
                  style.selectNetwork,
                )}
              >
                {WalletProfiles.OpenExplorer}
              </span>
            </a>
          )}
          <Divider />
          <div
            className={style.selectOption}
            onMouseOver={() => setHoveredText(WalletProfiles.Disconnect)}
            onClick={disconnectWallet}
          >
            <img src={enableImageLink('close', hoveredText === WalletProfiles.Disconnect)} alt="" />
            <span
              className={cn(hoveredText === WalletProfiles.Disconnect ? style.red : undefined, style.selectNetwork)}
            >
              {WalletProfiles.Disconnect}
            </span>
          </div>
        </div>
      </ButtonSelector>
    )
  );
};

export default WalletSelector;
