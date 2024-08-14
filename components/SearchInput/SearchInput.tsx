import React from 'react';
import cn from 'classnames';

import style from 'components/SearchInput/SearchInput.module.scss';

interface SearchInputProps {
  value: string;
  onChange: (value) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ value, onChange, placeholder, className }: SearchInputProps) => (
  <section className={cn(style.container, className)}>
    <img src="/assets/icons/search.svg" alt="" width={12} height={18} />
    <input
      className={style.input}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </section>
);

export default SearchInput;
