# Component Reference

Quick reference for common Hanzo GUI components. For full API, see https://gui.hanzo.ai/docs/components

## Layout

### Stacks

```tsx
import { XStack, YStack, ZStack } from '@hanzo/gui'

<YStack gap="$4">        {/* column layout */}
<XStack gap="$2">        {/* row layout */}
<ZStack>                 {/* overlay/absolute positioning */}
```

Common props: `gap`, `padding`, `margin`, `alignItems`, `justifyContent`, `flex`, `flexWrap`

### View / Text

Base components - all others extend these:

```tsx
import { View, Text } from '@hanzo/gui'

<View padding="$4" backgroundColor="$background" />
<Text color="$color" fontSize="$4">Hello</Text>
```

## Inputs

### Button

```tsx
import { Button } from '@hanzo/gui'

<Button>Default</Button>
<Button size="$4">Sized</Button>
<Button theme="blue">Themed</Button>
<Button variant="outlined">Outlined</Button>
<Button circular icon={Plus} />
<Button disabled>Disabled</Button>
```

### Input

```tsx
import { Input } from '@hanzo/gui'

<Input placeholder="Enter text" />
<Input size="$4" />
<Input secureTextEntry />  {/* password */}
<Input keyboardType="email-address" />
```

### TextArea

```tsx
import { TextArea } from '@hanzo/gui'

<TextArea placeholder="Long text..." numberOfLines={4} />
```

### Checkbox

```tsx
import { Checkbox } from '@hanzo/gui'

<Checkbox id="terms" checked={checked} onCheckedChange={setChecked}>
  <Checkbox.Indicator>
    <Check />
  </Checkbox.Indicator>
</Checkbox>
```

### Switch

```tsx
import { Switch } from '@hanzo/gui'

<Switch checked={on} onCheckedChange={setOn}>
  <Switch.Thumb />
</Switch>
```

### RadioGroup

```tsx
import { RadioGroup } from '@hanzo/gui'

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroup.Item value="a" id="a">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
  <RadioGroup.Item value="b" id="b">
    <RadioGroup.Indicator />
  </RadioGroup.Item>
</RadioGroup>
```

### Slider

```tsx
import { Slider } from '@hanzo/gui'

<Slider value={[value]} onValueChange={([v]) => setValue(v)} max={100} step={1}>
  <Slider.Track>
    <Slider.TrackActive />
  </Slider.Track>
  <Slider.Thumb index={0} />
</Slider>
```

## Overlays

### Dialog

```tsx
import { Dialog } from '@hanzo/gui'

<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay key="overlay" />
    <Dialog.Content key="content">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close asChild>
        <Button>Close</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>
```

### Sheet

```tsx
import { Sheet } from '@hanzo/gui'

<Sheet open={open} onOpenChange={setOpen} snapPoints={[80]} dismissOnSnapToBottom>
  <Sheet.Overlay />
  <Sheet.Frame padding="$4">
    <Sheet.Handle />
    {/* content */}
  </Sheet.Frame>
</Sheet>
```

### Popover

```tsx
import { Popover } from '@hanzo/gui'

<Popover>
  <Popover.Trigger asChild>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Popover.Arrow />
    {/* content */}
  </Popover.Content>
</Popover>
```

### Tooltip

```tsx
import { Tooltip } from '@hanzo/gui'

<Tooltip>
  <Tooltip.Trigger>
    <Button>Hover me</Button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <Tooltip.Arrow />
    <Text>Tooltip text</Text>
  </Tooltip.Content>
</Tooltip>
```

## Navigation

### Tabs

```tsx
import { Tabs } from '@hanzo/gui'

<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1"><Text>Tab 1</Text></Tabs.Tab>
    <Tabs.Tab value="tab2"><Text>Tab 2</Text></Tabs.Tab>
  </Tabs.List>
  <Tabs.Content value="tab1">{/* content */}</Tabs.Content>
  <Tabs.Content value="tab2">{/* content */}</Tabs.Content>
</Tabs>
```

### Select

```tsx
import { Select } from '@hanzo/gui'

<Select value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Viewport>
      <Select.Item value="a" index={0}>
        <Select.ItemText>Option A</Select.ItemText>
      </Select.Item>
      <Select.Item value="b" index={1}>
        <Select.ItemText>Option B</Select.ItemText>
      </Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select>
```

## Display

### Card

```tsx
import { Card } from '@hanzo/gui'

<Card>
  <Card.Header>
    <H3>Title</H3>
  </Card.Header>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
  <Card.Background>
    <Image src="..." />
  </Card.Background>
</Card>
```

### Avatar

```tsx
import { Avatar } from '@hanzo/gui'

<Avatar circular size="$6">
  <Avatar.Image src="..." />
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar>
```

### Separator

```tsx
import { Separator } from '@hanzo/gui'

<Separator />                    {/* horizontal */}
<Separator vertical />           {/* vertical */}
```

### Spinner

```tsx
import { Spinner } from '@hanzo/gui'

<Spinner />
<Spinner size="large" color="$blue10" />
```

### Progress

```tsx
import { Progress } from '@hanzo/gui'

<Progress value={60}>
  <Progress.Indicator animation="bouncy" />
</Progress>
```

## Typography

```tsx
import { H1, H2, H3, H4, H5, H6, Paragraph, Text } from '@hanzo/gui'

<H1>Heading 1</H1>
<Paragraph>Body text paragraph</Paragraph>
<Text fontSize="$4" color="$color11">Custom text</Text>
```

## Utilities

### Label

```tsx
import { Label } from '@hanzo/gui'

<Label htmlFor="input-id">Label Text</Label>
<Input id="input-id" />
```

### Spacer

```tsx
import { Spacer } from '@hanzo/gui'

<XStack>
  <Text>Left</Text>
  <Spacer />           {/* flex: 1 */}
  <Text>Right</Text>
</XStack>

<Spacer size="$4" />   {/* fixed size */}
```

### ScrollView

```tsx
import { ScrollView } from '@hanzo/gui'

<ScrollView>
  {/* scrollable content */}
</ScrollView>
```

### Image

```tsx
import { Image } from '@hanzo/gui'

<Image source={{ uri: '...' }} width={200} height={200} />
```

## Adapt Pattern

Make components responsive to platform/screen size:

```tsx
import { Adapt, Dialog, Sheet } from '@hanzo/gui'

<Dialog>
  {/* On small touch screens, render as Sheet instead */}
  <Adapt when="sm" platform="touch">
    <Sheet modal>
      <Sheet.Frame>
        <Adapt.Contents />
      </Sheet.Frame>
    </Sheet>
  </Adapt>

  <Dialog.Portal>
    <Dialog.Content>
      {/* Dialog content - also used by Adapt.Contents */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>
```
