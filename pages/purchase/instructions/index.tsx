import classNames from 'classnames';
import Command from 'components/Command';
import { StaticLink } from 'configs/links';
import { ISteps } from 'interfaces/nodeSale';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { PalomaInstructionsSteps, SupportSystems } from 'utils/data';

import style from './instructions.module.scss';

const Instructions = () => {
  const router = useRouter();
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const type = params.get('type');

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
    if (nextStep > PalomaInstructionsSteps[currentTab].length - 1) {
      router.push(StaticLink.BUYMOREBOARD);
    } else if (nextStep >= 0) {
      setCurrentStep(nextStep);
    }
    window.scrollTo(0, 0);
  };

  const myStep = useMemo(() => {
    return PalomaInstructionsSteps[currentTab][currentStep];
  }, [currentStep, currentTab]);

  const stepsContainer = (steps: ISteps[]) => {
    return (
      <div className={style.stepItems}>
        {steps.map((step, index) => (
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
            {step.commands && (
              <div className={style.itemSteps}>
                {step.commands.map((item, index) => (
                  <Command
                    key={index}
                    step={String.fromCharCode(97 + index)}
                    title={item.name}
                    command={item.command}
                    copyCommand={item.copyCommand}
                    instruction={item.instruction}
                  />
                ))}
              </div>
            )}
            {step.alert && (
              <div className={style.itemAlert}>
                <div className={style.alertBgContent} />
                <div className={style.alertBody}>
                  <div className={style.alertType}>
                    <img
                      src={`/assets/icons/${step.alert.type.toLowerCase()}_alert.svg`}
                      alt={`${step.alert.type}-alert`}
                    />
                    {step.alert.type}
                  </div>
                  <div>{step.alert.text}</div>
                </div>
              </div>
            )}
            {step.img && <div className={style.itemImg}>{step.img}</div>}
          </div>
        ))}
      </div>
    );
  };
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
        {myStep.steps && stepsContainer(myStep.steps)}
        {myStep.subItems && (
          <div className={style.subItems}>
            {myStep.subItems.map((subItem, index) => (
              <div key={index}>
                {subItem.title && <div className={style.subTitle}>{subItem.title}</div>}
                {subItem.describe && <div className={style.subDescribe}>{subItem.describe}</div>}
                {subItem.body && <div className={style.subBody}>{subItem.body}</div>}
                {subItem.steps && stepsContainer(subItem.steps)}
              </div>
            ))}
          </div>
        )}
        {myStep.footer && <div className={style.stepFooter}>{myStep.footer}</div>}
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

export default Instructions;
