import classNames from 'classnames';
import Command from 'components/Command';
import { StaticLink } from 'configs/links';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { PalomaDownloadAndInstallSteps, SupportSystems } from 'utils/data';

import style from './download.module.scss';

const DownloadAndInstall = () => {
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState(SupportSystems.Mac);
  const [currentStep, setCurrentStep] = useState(0);

  const onChangeTab = (tab: string) => {
    if (tab !== currentTab) {
      setCurrentStep(0);
      setCurrentTab(tab);
    }
  };

  const onChangeStep = (step: number) => {
    const nextStep = currentStep + step;
    if (nextStep > PalomaDownloadAndInstallSteps[currentTab].length - 1) {
      router.push(StaticLink.ACTIVATE);
    } else if (nextStep >= 0) {
      setCurrentStep(nextStep);
    }
    window.scrollTo(0, 0);
  };

  const myStep = useMemo(() => {
    return PalomaDownloadAndInstallSteps[currentTab][currentStep];
  }, [currentStep, currentTab]);

  return (
    <section className={style.container}>
      <h1>Paloma LightNode Download and Install</h1>
      <p className={style.describe}>Choose your OS and follow the instructions below.</p>
      <div className={style.tabs}>
        {Object.values(SupportSystems).map((system, index) => (
          <div
            key={index}
            onClick={() => onChangeTab(system)}
            className={classNames(style.tab, currentTab === system ? style.active : undefined)}
          >
            {system}
          </div>
        ))}
      </div>
      <div className={style.stepModal}>
        <div className={style.stepHeader}>{myStep.head}</div>
        {myStep.describe && <div className={style.stepDescribe}> {myStep.describe}</div>}
        <div className={style.stepItems}>
          {myStep.steps &&
            myStep.steps.map((step, index) => (
              <div key={index}>
                <div className={style.itemHead}>
                  <div className={style.roundBg}>{index + 1}</div>
                  {step.title}
                </div>
                {step.externalBtns && (
                  <div className={style.externalBtns}>
                    {step.externalBtns.map((btn, index) => (
                      <a key={index} href={btn.link} target="_blank" className={style.externalBtn}>
                        {btn.text}
                      </a>
                    ))}
                  </div>
                )}
                {step.describe && <div className={style.itemDescribe}>{step.describe}</div>}
                {step.items && (
                  <div className={style.itemSteps}>
                    {step.items.map((item, index) => (
                      <Command
                        key={index}
                        step={String.fromCharCode(97 + index)}
                        title={item.name}
                        command={item.command}
                        copyCommand={item.copyCommand}
                      />
                    ))}
                  </div>
                )}
                {step.img && <div className={style.itemImg}>{step.img}</div>}
              </div>
            ))}
        </div>
        <div className={style.stepBtns}>
          {currentStep > 0 && (
            <button className={style.stepBtn} onClick={() => onChangeStep(-1)}>
              Previous
            </button>
          )}
          <button className={style.stepBtn} onClick={() => onChangeStep(1)}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default DownloadAndInstall;
