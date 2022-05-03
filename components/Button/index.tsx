export default function Button({
  className = '',
  href = '',
  target = '_blank',
  ...props
}) {
  return href ? (
    <a href={href} target={target}>
      <button {...props} className={['button', className].join(' ')} />
    </a>
  ) : (
    <button {...props} className={['button', className].join(' ')} />
  )
}
