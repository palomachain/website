import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import style from './Command.module.scss';

interface ICommandWrapper {
  step?: string | number;
  title?: string | JSX.Element;
  command?: string | JSX.Element;
  copyCommand?: string;
  instruction?: string | JSX.Element;
  isCopyAvailable?: boolean;
  className?: string;
}

const Command = ({
  step = 'a',
  title = 'Copy and Past the command:',
  command,
  copyCommand,
  instruction,
  isCopyAvailable = true,
  className,
}: ICommandWrapper) => {
  const [isCopied, setCopied] = useState(false);

  const onClickCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(copyCommand);
  };

  useEffect(() => {
    if (isCopied) {
      const delayDebounceFn = setTimeout(() => {
        setCopied(false);
      }, 3000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [isCopied]);

  return (
    <section className={style.container}>
      <div className={style.head}>
        <p>{step}.</p> <p>{title}</p>
      </div>
      {command && (
        <div className={style.shCommand}>
          <div className={style.command}>{command}</div>
          {isCopyAvailable && (
            <div className={classNames(style.copyIcon, isCopied ? style.copied : undefined)} onClick={onClickCopy} />
          )}
        </div>
      )}
      {instruction && <div>{instruction}</div>}
    </section>
  );
};

export default Command;
