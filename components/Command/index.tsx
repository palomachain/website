import React from 'react';

import style from './Command.module.scss';

interface ICommandWrapper {
  step?: string | number;
  title?: string | JSX.Element;
  command?: string | JSX.Element;
  copyCommand?: string;
  isCopyAvailable?: boolean;
  className?: string;
}

const Command = ({
  step = 'a',
  title = 'Copy and Past the command:',
  command,
  copyCommand,
  isCopyAvailable = true,
  className,
}: ICommandWrapper) => (
  <section className={style.container}>
    <div className={style.head}>
      <p>{step}.</p> {title}
    </div>
    {command && (
      <div className={style.shCommand}>
        <div className={style.command}>{command}</div>
        {isCopyAvailable && (
          <img src="/assets/icons/copy.svg" alt="copy" onClick={() => navigator.clipboard.writeText(copyCommand)} />
        )}
      </div>
    )}
  </section>
);

export default Command;
