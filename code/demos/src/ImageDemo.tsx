import { Image } from '@hanzo/gui-image'

export function ImageDemo() {
  return (
    <>
      <Image
        src="https://picsum.photos/200/300"
        width={200}
        height={300}
        onLoad={() => {}}
        onLayout={(e) => {}}
      />
    </>
  )
}
