import classNames from 'classnames';
import { BaseSyntheticEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

import style from './Passcode.module.scss';

interface PasscodeProps {
  passcodeValue: (string | number)[];
  setPasscodeValue: (e: any) => void;
  disabled?: boolean;
  className?: string;
}

const PasscodeInput = ({ passcodeValue, setPasscodeValue, disabled = false, className }: PasscodeProps) => {
  const [currentFocusedIndex, setCurrentFocusedIndex] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement> | []>([]);

  const inputRef0 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);

  const refs = [inputRef0, inputRef1, inputRef2, inputRef3];

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const keyCode = parseInt(e.key);
    if (!(keyCode >= 0 && keyCode <= 9) && e.key !== 'Backspace' && !(e.metaKey && e.key === 'v')) {
      e.preventDefault();
    }
  };

  const onChange = (e: BaseSyntheticEvent, index: number) => {
    setPasscodeValue((preValue: (string | number)[]) => {
      const newArray = [...preValue];

      if (parseInt(e.target.value)) {
        newArray[index] = parseInt(e.target.value);
      } else {
        newArray[index] = e.target.value;
      }

      return newArray;
    });
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (index === 0) {
        setCurrentFocusedIndex(0);
      } else {
        setCurrentFocusedIndex(index - 1);
        if (inputRefs && inputRefs.current && index === currentFocusedIndex) {
          refs[index - 1].current.focus();
        }
      }
    } else {
      if (parseInt(e.key) && index < passcodeValue.length - 1) {
        setCurrentFocusedIndex(index + 1);
        if (inputRefs && inputRefs.current && index === currentFocusedIndex) {
          refs[index + 1].current.focus();
        }
      }
    }
  };

  const onFocus = (e: BaseSyntheticEvent, index: number) => {
    setCurrentFocusedIndex(index);
  };

  useEffect(() => {
    document.addEventListener('paste', async () => {
      // Handle all sub-usecases here

      const pastePermission = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName,
      });

      if (pastePermission.state === 'denied') {
        throw new Error('Not allowed to read clipboard');
      }

      const clipboardContent = await navigator.clipboard.readText();
      try {
        let newArray: Array<number | string> = clipboardContent.split('');
        newArray = newArray.map((num) => Number(num));

        const lastIndex = passcodeValue.length - 1;
        if (currentFocusedIndex > 0) {
          const remainingPlaces = lastIndex - currentFocusedIndex;
          const partialArray = newArray.slice(0, remainingPlaces + 1);
          setPasscodeValue([...passcodeValue.slice(0, currentFocusedIndex), ...partialArray]);
        } else {
          setPasscodeValue([...newArray, ...passcodeValue.slice(newArray.length - 1, lastIndex)]);
        }

        if (newArray.length < passcodeValue.length && currentFocusedIndex === 0) {
          setCurrentFocusedIndex(newArray.length - 1);
          refs[newArray.length - 1].current.focus();
        } else {
          setCurrentFocusedIndex(passcodeValue.length - 1);
          refs[passcodeValue.length - 1].current.focus();
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      document.removeEventListener('paste', () => console.log('Removed paste listner'));
    };
  }, [passcodeValue, currentFocusedIndex]);

  return (
    <section className={style.container}>
      {passcodeValue.map((value: string | number, index: number) => (
        <div className={style.digitDiv} key={index}>
          <input
            inputMode="numeric"
            maxLength={1}
            type="text"
            value={String(value)}
            onChange={(e) => onChange(e, index)}
            onKeyUp={(e) => onKeyUp(e, index)}
            onKeyDown={(e) => onKeyDown(e)}
            onFocus={(e) => onFocus(e, index)}
            className={classNames(style.digitInput, String(value) === '' ? style.validInput : undefined)}
            autoFocus={index === currentFocusedIndex}
            ref={refs[index]}
          />
        </div>
      ))}
    </section>
  );
};

export default PasscodeInput;
