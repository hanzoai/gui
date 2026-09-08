import { H3 } from '@hanzo/gui'

export const SubTitle = ({ children, ...props }) => {
  if (!children) {
    return null
  }

  // takes the text even if it's wrapped in `<p>`
  // https://github.com/wooorm/xdm/issues/47
  const childText =
    typeof children === 'string' ? children : children.props?.children || children

  return (
    <H3
      position="relative"
      maxW="100%"
      color="$accent7"
      width="100%"
      fontFamily="$mono"
      size="$7"
      letterSpacing={-0.25}
      render="p"
      pb="$3"
      mb="$3"
      $platform-web={{
        textWrap: 'balance',
      }}
      $gtSm={{
        width: 'max-content',
      }}
      {...props}
    >
      {childText}
    </H3>
  )
}
